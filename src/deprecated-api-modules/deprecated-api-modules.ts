export const message = 'Use `imports` property for the list of imported modules';
export const deprecatedApiModules = {
    create(context) {
        return {
            ClassDeclaration: (node) => {
                const property = getModuleModulesProperty(node);
                if (property) {
                    context.report({ node: property, message });
                }
            }
        };
    }
};

function getModuleModulesProperty(node) {
    const decorator = (node.decorators || []).find(d => d.expression && d.expression.callee && d.expression.callee.name === 'Module');
    if (!decorator) {
        return false;
    }
    const [argument] = decorator.expression.arguments;
    const result = (argument.type === 'ObjectExpression') && (argument.properties || []).find(property => property.key && property.key.name === 'modules');
    return result;
}
