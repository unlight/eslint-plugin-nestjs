export const message = 'Use `imports` property for the list of imported modules';
export const deprecatedApiModules = {
    create(context) {
        return {
            ClassDeclaration: (node) => {
                if (hasModulesProperty(node)) {
                    context.report({ node, message });
                }
            }
        };
    }
};

function hasModulesProperty(node) {
    const decorator = (node.decorators || []).find(d => d.expression && d.expression.callee && d.expression.callee.name === 'Module');
    if (!decorator) {
        return false;
    }
    const [argument] = decorator.expression.arguments;
    const result = (argument.type === 'ObjectExpression') && (argument.properties || []).some(property => property.key && property.key.name === 'modules');
    return result;
}
