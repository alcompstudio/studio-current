const { Node } = require('ts-morph'); // Node используется в getReactComponentProps и getJsDocInfo

/**
 * Извлекает JSDoc комментарии для узла.
 * @param {Node} node - Узел ts-morph.
 * @returns {{ description: string, tags: {tagName: string, text: string}[] }}
 */
function getJsDocInfo(node) {
  const jsDocNode = node.getJsDocs ? node.getJsDocs()[0] : null;
  if (!jsDocNode) return { description: '', tags: [] };
  const description = jsDocNode.getDescription ? jsDocNode.getDescription().trim() : '';
  const tags = jsDocNode.getTags ? jsDocNode.getTags().map(tag => {
    const commentText = tag.getCommentText();
    return {
      tagName: tag.getTagName(),
      text: commentText ? commentText.trim() : ''
    };
  }) : [];
  return { description, tags };
}

/**
 * Извлекает информацию о пропсах React компонента.
 * @param {import('ts-morph').FunctionDeclaration | import('ts-morph').VariableDeclaration} node - Узел функции или переменной компонента.
 * @returns {object[]} - Массив информации о пропсах.
 */
function getReactComponentProps(node) { 
  const props = [];
  const funcNode = Node.isFunctionDeclaration(node) 
    ? node 
    : (Node.isVariableDeclaration(node) && node.getInitializer && 
        (Node.isArrowFunction(node.getInitializer()) || Node.isFunctionExpression(node.getInitializer())))
      ? node.getInitializer()
      : null;

  if (!funcNode || typeof funcNode.getParameters !== 'function') {
    if (Node.isClassDeclaration(node) && node.getHeritageClauses().some(hc => hc.getText().includes('React.Component'))) {
        console.warn(`Извлечение пропсов для классового компонента ${node.getName()} пока не реализовано детально.`);
    }
    return props;
  }

  const firstParam = funcNode.getParameters()[0];

  if (firstParam) {
    let actualPropsType; 
    const paramType = firstParam.getType();
    let paramTypeText = 'any';
    try {
        paramTypeText = paramType.getText(); 
    } catch (e) {
        console.warn(`Не удалось получить текст для paramType в ${node.getName()} в ${node.getSourceFile().getFilePath()}: ${e.message}. Установлен тип 'any'.`);
    }

    if (paramTypeText.startsWith('React.FC<') || paramTypeText.startsWith('FC<')) {
      const typeArgs = paramType.getTypeArguments();
      if (typeArgs.length > 0) {
        actualPropsType = typeArgs[0];
      }
    } else if (paramType.isObject() || paramType.isInterface() || paramType.isIntersection() || paramType.isUnion()) {
        actualPropsType = paramType;
    }

    const firstParamTypeNode = firstParam.getTypeNode();
    if (!actualPropsType && firstParamTypeNode && Node.isTypeLiteralNode(firstParamTypeNode)) {
        actualPropsType = firstParamTypeNode.getType();
    }
    
    if (Node.isObjectBindingPattern(firstParam.getNameNode())) {
        if (!actualPropsType) {
             console.warn(`Не удалось определить тип для деструктурированных пропсов в ${node.getName()} в ${node.getSourceFile().getFilePath()}.`);
        }
    }

    if (actualPropsType) {
      const properties = actualPropsType.getApparentProperties(); 
      
      properties.forEach(propSymbol => {
        const propName = propSymbol.getName();
        const declarations = propSymbol.getDeclarations();
        let propTypeText = 'any';
        let propDescription = '';
        let isOptional = propSymbol.isOptional();

        if (declarations && declarations.length > 0) {
          const firstDeclaration = declarations[0]; 
          const typeNode = typeof firstDeclaration.getTypeNode === 'function' ? firstDeclaration.getTypeNode() : null;
          
          if (typeNode) {
            propTypeText = typeNode.getText();
          } else {
            try {
              propTypeText = propSymbol.getTypeAtLocation(node).getText();
            } catch (e) {
              try {
                  propTypeText = propSymbol.getTypeAtLocation(firstDeclaration).getText();
              } catch (e2) {
                  propTypeText = 'any';
              }
            }
          }

          propDescription = getJsDocInfo(firstDeclaration).description;
          if (typeof firstDeclaration.hasQuestionToken === 'function') {
            isOptional = firstDeclaration.hasQuestionToken() || isOptional;
          }
        } else {
           try {
                propTypeText = propSymbol.getTypeAtLocation(node).getText();
            } catch (e) {
                 propTypeText = 'any';
            }
        }
        props.push({ name: propName, type: propTypeText, description: propDescription, required: !isOptional });
      });
    }
  }
  return props;
}

module.exports = {
  getJsDocInfo,
  getReactComponentProps
};
