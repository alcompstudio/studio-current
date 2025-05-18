const fs = require('fs').promises;
const path = require('path');
const { Project, SyntaxKind, Node, ts } = require('ts-morph');
const {
  generateMarkdownForStructure,
  generateComponentMetadataFile,
  generateMermaidDependencies
} = require('./lib/output-generators.js');
const {
  getJsDocInfo,
  getReactComponentProps
} = require('./lib/ast-helpers.js');

// --- Конфигурация ---
const SRC_DIR_RELATIVE = '../../src'; 
const DOCS_COMPONENTS_DIR_RELATIVE = '../../docs/components'; 

const SRC_DIR = path.join(__dirname, SRC_DIR_RELATIVE);
const DOCS_COMPONENTS_DIR = path.join(__dirname, DOCS_COMPONENTS_DIR_RELATIVE);

const TARGET_DIRECTORIES = ['components', 'hooks', 'lib', 'app/(app)']; 

// --- Инициализация ts-morph ---
const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../../tsconfig.json'),
});

// --- Вспомогательные функции ---

function analyzeSourceFile(sourceFile) {
  const filePath = sourceFile.getFilePath();
  console.log(`Анализ файла: ${path.relative(process.cwd(), filePath)}`);
  const structures = [];

  sourceFile.getExportedDeclarations().forEach((declarations, name) => {
    declarations.forEach(declarationNode => {
      let structure = {
        name: name, type: '', filePath: filePath, description: '', tags: [],
        props: [], params: [], returnType: '',
        dependencies: sourceFile.getImportDeclarations().map(imp => ({
            moduleSpecifier: imp.getModuleSpecifierValue(),
            namedImports: imp.getNamedImports().map(ni => ni.getName()),
            defaultImport: imp.getDefaultImport()?.getText() || null
        }))
      };

      const { description, tags } = getJsDocInfo(declarationNode);
      structure.description = description;
      structure.tags = tags;

      if (Node.isFunctionDeclaration(declarationNode) || (Node.isVariableDeclaration(declarationNode) && declarationNode.getInitializer && (Node.isArrowFunction(declarationNode.getInitializer()) || Node.isFunctionExpression(declarationNode.getInitializer())))) {
        const funcNode = Node.isFunctionDeclaration(declarationNode) ? declarationNode : declarationNode.getInitializer();
        let isReactComponent = false;

        if (name && name[0] === name[0].toUpperCase()) isReactComponent = true;
        if (!isReactComponent && funcNode.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0) isReactComponent = true;
        if (!isReactComponent && funcNode.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0) isReactComponent = true;
        
        const firstParam = funcNode.getParameters ? funcNode.getParameters()[0] : null;
        if (!isReactComponent && firstParam) {
            const paramType = firstParam.getType();
            let paramTypeName = 'any';
            try { paramTypeName = paramType.getText(); } catch(e) { console.warn(`Не удалось получить текст типа для первого параметра ${name} в ${filePath}: ${e.message}`); }
            if (paramTypeName.includes('Props') || paramTypeName.startsWith('React.FC') || paramTypeName.startsWith('FC<')) isReactComponent = true;
        }
        const returnTypeNode = funcNode.getReturnTypeNode();
        if (!isReactComponent && returnTypeNode) {
            const returnTypeText = returnTypeNode.getText();
            if (returnTypeText.includes('JSX.Element') || returnTypeText.includes('React.ReactElement') || returnTypeText.includes('React.ReactNode')) isReactComponent = true;
        }
        
        if (isReactComponent) {
            structure.type = 'ReactComponent';
            structure.props = getReactComponentProps(declarationNode);
            const rtAnnotation = funcNode.getReturnTypeNode();
            if (rtAnnotation) {
                structure.returnType = rtAnnotation.getText();
            } else {
                try {
                     structure.returnType = funcNode.getReturnType().getText() || 'JSX.Element'; 
                } catch (e) {
                     structure.returnType = 'JSX.Element'; 
                }
            }
        } else {
            structure.type = 'Function';
            structure.params = funcNode.getParameters().map(p => {
                let paramResolvedType = 'any';
                try { paramResolvedType = p.getTypeNode() ? p.getTypeNode().getText() : (p.getType() ? p.getType().getText() : 'any'); } catch(e) { console.warn(`Не удалось получить тип для параметра ${p.getName()} в ${name}: ${e.message}`);}
                return {
                    name: p.getName(),
                    type: paramResolvedType, 
                    description: getJsDocInfo(p).description,
                    optional: p.isOptional() || p.hasInitializer()
                };
            });
            let funcReturnText = 'any';
            try { funcReturnText = funcNode.getReturnTypeNode() ? funcNode.getReturnTypeNode().getText() : (funcNode.getReturnType() ? funcNode.getReturnType().getText() : 'any'); } catch(e) { console.warn(`Не удалось получить возвращаемый тип для ${name}: ${e.message}`);}
            structure.returnType = funcReturnText;
        }
      } else if (Node.isClassDeclaration(declarationNode)) {
        structure.type = 'Class';
        if (declarationNode.getHeritageClauses().some(hc => hc.getText().includes('React.Component') || hc.getText().includes('React.PureComponent'))) {
            structure.type = 'ReactComponent (Class)';
        }
      } else if (Node.isInterfaceDeclaration(declarationNode) || Node.isTypeAliasDeclaration(declarationNode)) {
        structure.type = Node.isInterfaceDeclaration(declarationNode) ? 'Interface' : 'TypeAlias';
      } else {
        if (Node.isVariableDeclaration(declarationNode) && !declarationNode.getInitializer()) {
            let varType = 'any';
            try { varType = declarationNode.getType().getText(); } catch(e){ console.warn(`Не удалось получить тип для переменной ${name}: ${e.message}`); }
             structure.type = `Variable (${varType})`; 
        } else if (Node.isVariableDeclaration(declarationNode) && declarationNode.getInitializer()) {
            structure.type = `Variable (${declarationNode.getInitializer().getKindName()})`;
        } else {
            structure.type = declarationNode.getKindName();
        }
      }
      if (structure.type) structures.push(structure);
    });
  });

  const defaultExport = sourceFile.getDefaultExportSymbol();
  if (defaultExport) {
      const declaration = defaultExport.getValueDeclaration() || (defaultExport.getDeclarations().length > 0 ? defaultExport.getDeclarations()[0] : null);
      if (declaration && (Node.isFunctionDeclaration(declaration) || Node.isArrowFunction(declaration) || Node.isFunctionExpression(declaration) || Node.isClassDeclaration(declaration))) {
          const alreadyAdded = structures.some(s => s.name === defaultExport.getName() || (declaration.getName && s.name === declaration.getName()) || s.name === 'default');
          if (!alreadyAdded) {
              console.warn(`Обработка анонимного/неименованного default export для ${filePath} требует доработки для извлечения структуры.`);
              let defaultStructure = {
                name: 'default', type: '', filePath: filePath, description: getJsDocInfo(declaration).description,
                tags: getJsDocInfo(declaration).tags, props: [], params: [], returnType: '',
                dependencies: sourceFile.getImportDeclarations().map(imp => ({
                    moduleSpecifier: imp.getModuleSpecifierValue(),
                    namedImports: imp.getNamedImports().map(ni => ni.getName()),
                    defaultImport: imp.getDefaultImport()?.getText() || null
                }))
              };
              if (Node.isFunctionDeclaration(declaration) || Node.isArrowFunction(declaration) || Node.isFunctionExpression(declaration)) {
                const funcNode = declaration; 
                let isReactComponent = false;
                if (funcNode.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 || funcNode.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0) isReactComponent = true;
                const firstParam = funcNode.getParameters ? funcNode.getParameters()[0] : null;
                if (!isReactComponent && firstParam) {
                    const paramType = firstParam.getType();
                    let paramTypeName = 'any';
                    try { paramTypeName = paramType.getText(); } catch(e){}
                    if (paramTypeName.includes('Props') || paramTypeName.startsWith('React.FC') || paramTypeName.startsWith('FC<')) isReactComponent = true;
                }
                 if (isReactComponent) defaultStructure.type = 'ReactComponent (Default Export)';
                 else defaultStructure.type = 'Function (Default Export)';
              } else if (Node.isClassDeclaration(declaration)) {
                defaultStructure.type = 'Class (Default Export)';
              }
              if (defaultStructure.type) structures.push(defaultStructure);
          }
      }
  }
  return structures;
}

async function extractAndGenerateDocumentation() {
  console.log('Запуск извлечения структуры кода и генерации документации...');
  for (const dir of TARGET_DIRECTORIES) {
      project.addSourceFilesAtPaths(path.join(SRC_DIR, dir, '**/*.{ts,tsx,js,jsx}'));
  }
  
  const sourceFiles = project.getSourceFiles();
  console.log(`Найдено ${sourceFiles.length} файлов для анализа.`);

  for (const sourceFile of sourceFiles) {
    const filePath = sourceFile.getFilePath();
    if (filePath.endsWith('.d.ts') || filePath.endsWith('.metadata.json')) continue;
    const structures = analyzeSourceFile(sourceFile); 
    if (structures.length === 0) continue;
    const relativeSrcFilePath = path.relative(SRC_DIR, filePath);
    let dirForDocs = path.dirname(relativeSrcFilePath);

    // Исправление для пути, чтобы избежать docs/components/components
    // Если путь начинается с 'components' (например, 'components/ui' или 'components\auth'),
    // то мы берем только часть после 'components/' для формирования пути в docs.
    const componentsDirName = 'components'; 
    if (dirForDocs.startsWith(componentsDirName + path.sep) || dirForDocs === componentsDirName) {
      dirForDocs = dirForDocs.substring(componentsDirName.length).replace(/^\\+|^\/+/g, ''); // Удаляем 'components' и ведущий слеш/бекслеш
    }
    
    const docDir = path.join(DOCS_COMPONENTS_DIR, dirForDocs);
    const docFileName = `${path.basename(filePath, path.extname(filePath))}.md`;
    const docFilePath = path.join(docDir, docFileName);
    let fullMarkdownContent = `# Документация для \`${path.basename(filePath)}\`\n\n`;
    fullMarkdownContent += `*Путь к файлу: \`src/${relativeSrcFilePath}\`*\n\n`;
    if (structures[0] && structures[0].dependencies) {
        fullMarkdownContent += `## Зависимости файла\n\n`;
        fullMarkdownContent += generateMermaidDependencies(structures[0].dependencies, path.basename(filePath));
        fullMarkdownContent += `\n`;
    }
    for (const structure of structures) {
      fullMarkdownContent += generateMarkdownForStructure(structure, relativeSrcFilePath);
      if (['ReactComponent', 'Function', 'Class', 'ReactComponent (Class)', 'Function (Default Export)', 'Class (Default Export)', 'ReactComponent (Default Export)'].includes(structure.type)) {
           await generateComponentMetadataFile(structure, relativeSrcFilePath);
      }
    }
    await fs.mkdir(docDir, { recursive: true });
    await fs.writeFile(docFilePath, fullMarkdownContent);
    console.log(`Документация для ${path.basename(filePath)} сохранена в ${docFilePath}`);
  }
  console.log('Извлечение структуры кода и генерация документации завершены.');
}

async function main() {
  try {
    await extractAndGenerateDocumentation();
  } catch (error) {
    console.error('Ошибка при извлечении структуры кода из CLI:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  extractAndGenerateDocumentation,
};
