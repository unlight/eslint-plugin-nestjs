import { ClassDeclaration, CallExpression } from 'estree';
import { getDecoratorByName } from '../utils';

export const message = 'Use `imports` property for the list of imported modules';
export const deprecatedApiModules = {
    create(context) {
        return {
            ClassDeclaration: (node: ClassDeclaration) => {
                const property = getModuleModulesProperty(node);
                if (property) {
                    context.report({ node: property, message });
                }
            }
        };
    }
};

function getModuleModulesProperty(node: any) {
    const decorator = getDecoratorByName(node, 'Module');
    if (!decorator) {
        return false;
    }
    const [argument] = (decorator.expression as CallExpression).arguments;
    const result = (argument.type === 'ObjectExpression') && (argument.properties || []).find(property => {
        return property.key && property.key.type === 'Identifier' && property.key.name === 'modules';
    });
    return result;
}
