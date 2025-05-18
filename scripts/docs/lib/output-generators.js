const fs = require('fs').promises;
const path = require('path');

/**
 * Генерирует Markdown документацию для одной структуры.
 * @param {object} structureInfo - Информация о структуре.
 * @param {string} relativeSrcFilePath - Относительный путь к исходному файлу от корня src.
 * @returns {string} - Markdown строка.
 */
function generateMarkdownForStructure(structureInfo, relativeSrcFilePath) {
  let md = `### \`${structureInfo.name}\` (${structureInfo.type})\n\n`;
  if (structureInfo.description) md += `**Описание:**\n\n${structureInfo.description.split('\n').map(l => `> ${l}`).join('\n')}\n\n`;
  if (structureInfo.props && structureInfo.props.length > 0) {
    md += `**Пропсы (Props):**\n\n| Имя | Тип | Обязательный | Описание |\n|---|---|---|---|\n`;
    structureInfo.props.forEach(prop => { md += `| \`${prop.name}\` | \`${prop.type.replace(/\|/g, '\\|')}\` | ${prop.required ? 'Да' : 'Нет'} | ${prop.description || ''} |\n`; });
    md += '\n';
  }
  if (structureInfo.params && structureInfo.params.length > 0) {
    md += `**Параметры:**\n\n| Имя | Тип | Опциональный | Описание |\n|---|---|---|---|\n`;
    structureInfo.params.forEach(param => { md += `| \`${param.name}\` | \`${param.type.replace(/\|/g, '\\|')}\` | ${param.optional ? 'Да' : 'Нет'} | ${param.description || ''} |\n`; });
    md += '\n';
  }
  if (structureInfo.returnType) md += `**Возвращает:** \`${structureInfo.returnType.replace(/\|/g, '\\|')}\`\n\n`;
  md += `*Источник: \`src/${relativeSrcFilePath}\`*\n\n---\n`;
  return md;
}

/**
 * Генерирует JSON метаданные для структуры.
 * @param {object} structureInfo - Информация о структуре.
 * @param {string} relativeSrcFilePath - Относительный путь к исходному файлу от корня src.
 */
async function generateComponentMetadataFile(structureInfo, relativeSrcFilePath) {
  const metadata = {
    component: structureInfo.name, version: "1.0.0", description: structureInfo.description,
    tags: structureInfo.tags, maintainer: "AI Agent / Auto-generated", type: structureInfo.type,
    path: relativeSrcFilePath, props: structureInfo.props || [], params: structureInfo.params || [],
    returnType: structureInfo.returnType || '',
    dependencies: structureInfo.dependencies.map(dep => dep.moduleSpecifier), 
    history: [{ date: new Date().toISOString().split('T')[0], author: "code-structure-extractor.js", changes: "Автоматически сгенерировано/обновлено." }],
    notes: "Эта информация была частично сгенерирована автоматически. Требуется проверка и дополнение."
  };

  let metadataFileName;
  if (structureInfo.name === 'default') {
    const baseName = path.basename(structureInfo.filePath, path.extname(structureInfo.filePath));
    metadataFileName = `_default_${baseName}.metadata.json`;
  } else {
    metadataFileName = `${structureInfo.name}.metadata.json`;
  }
  const metadataFilePath = path.join(path.dirname(structureInfo.filePath), metadataFileName);
  try {
    await fs.writeFile(metadataFilePath, JSON.stringify(metadata, null, 2));
    console.log(`Метаданные для ${structureInfo.name} (${metadataFileName}) сохранены в ${metadataFilePath}`);
  } catch (error) {
    console.error(`Ошибка при сохранении метаданных для ${structureInfo.name} (${metadataFileName}):`, error);
  }
}

/**
 * Генерирует Mermaid диаграмму зависимостей для файла.
 * @param {object[]} dependencies - Массив зависимостей из structureInfo.
 * @param {string} currentFileName - Имя текущего файла/компонента.
 * @returns {string} - Строка Mermaid диаграммы.
 */
function generateMermaidDependencies(dependencies, currentFileName) {
    if (!dependencies || dependencies.length === 0) return '';
    let mermaid = '```mermaid\nflowchart TD\n';
    mermaid += `    ${currentFileName.replace(/\W/g, '_')}[${currentFileName}]\n`; 
    dependencies.forEach(dep => {
        const moduleName = dep.moduleSpecifier.split('/').pop().replace(/\W/g, '_');
        mermaid += `    ${moduleName}[${dep.moduleSpecifier}]\n`;
        mermaid += `    ${currentFileName.replace(/\W/g, '_')} --> ${moduleName}\n`;
    });
    mermaid += '```\n';
    return mermaid;
}

module.exports = {
  generateMarkdownForStructure,
  generateComponentMetadataFile,
  generateMermaidDependencies
};
