export const message = 'Dependency must be provided through a class constructor';
export const useDependencyInjection = {
    create(context) {
        let constructor = null;
        let isInjectable = false;
        const imports: any[] = [];
        const isIdentifierFromImports = (name: string) => {
            return Boolean(imports.find(x => x.name === name));
        };
        return {
            Program: (node) => {
                (node.body as any[])
                    .filter(node => node.type === 'VariableDeclaration')
                    .map(node => node.declarations)
                    .reduce((acc, value) => acc.concat(value), [])
                    .forEach(node => {
                        imports.push({ name: node.id.name });
                    });
            },
            ImportDeclaration: (node) => {
                (node.specifiers as any[])
                    .map(specifier => specifier.local && specifier.local.name)
                    .filter(Boolean)
                    .forEach(name => {
                        imports.push({ name });
                    });
            },
            TSImportEqualsDeclaration: (node) => {
                const name = node.name.name;
                imports.push({ name });
            },
            ClassDeclaration: (node) => {
                if (isClassInjectable(node)) {
                    isInjectable = true;
                }
            },
            'ClassDeclaration:exit': () => {
                isInjectable = false;
            },
            MethodDefinition: (node) => {
                if (isConstructor(node)) {
                    constructor = node;
                }
            },
            'MethodDefinition:exit': () => {
                constructor = null;
            },
            AssignmentExpression: (node) => {
                if (isInjectable && constructor && isThisMemberNewExpression(node)) {
                    context.report({ node: node.right, message });
                }
            },
            ClassProperty: (node) => {
                if (!isInjectable || !node.value) {
                    return;
                }
                const nodeValue = node.value;
                if (isNewExpression(nodeValue)
                    || isRequireCall(nodeValue)
                    || isIdentifierFromImports(nodeValue.name)
                ) {
                    context.report({ node: nodeValue, message });
                }
            }
        };
    }
};

function isRequireCall(node) {
    return node && node.callee && node.callee.name === 'require';
}

function isNewExpression(node) {
    return node && node.type === 'NewExpression';
}

function isConstructor(node) {
    return node.key && node.key.name === 'constructor';
}

function isThisMemberNewExpression(node) {
    return node.operator === '=' && node.left && node.left.type === 'MemberExpression' && isNewExpression(node.right);
}

const isClassInjectable = (() => {
    const injectDecoratorNames = ['Component'];
    return (node) => {
        return (node.decorators || []).find(d => d.expression && d.expression.callee && d.expression.callee.name && injectDecoratorNames.includes(d.expression.callee.name));
    };
})();
