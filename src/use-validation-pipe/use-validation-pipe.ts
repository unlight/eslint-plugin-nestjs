import { getDecoratorByName } from '../utils';
import { MethodDefinition, CallExpression, ClassDeclaration } from 'estree';

export const message = 'Use pipe `ValidationPipe` for data validation';

export const useValidationPipe = {
    create(context) {
        let validationPipeInClass = false;
        return {
            ClassDeclaration: (node: ClassDeclaration) => {
                const classUsePipes = getDecoratorByName(node, 'UsePipes');
                validationPipeInClass = hasExprValidationPipe(classUsePipes);
            },
            'ClassDeclaration:exit': () => {
                validationPipeInClass = false;
            },
            MethodDefinition: (node: MethodDefinition) => {
                if (validationPipeInClass) {
                    return;
                }
                const param = node.value.params.find(p => getDecoratorByName(p, 'Body') !== undefined);
                if (!param) {
                    return;
                }
                const body = getDecoratorByName(param, 'Body');
                if (hasExprValidationPipe(body)) {
                    return;
                }
                const usePipes = getDecoratorByName(node, 'UsePipes');
                if (hasExprValidationPipe(usePipes)) {
                    return;
                }
                const { typeAnnotation } = param as any;
                if (typeAnnotation && typeAnnotation.typeAnnotation && ['GenericTypeAnnotation', 'TSTypeReference'].includes(typeAnnotation.typeAnnotation.type)) {
                    context.report({ node: param, message });
                }
            },
        };
    }
};

function hasExprValidationPipe(node) {
    if (!node) {
        return false;
    }
    return (node.expression as CallExpression).arguments
        .some(argument => {
            return (argument.type === 'NewExpression' && argument.callee.type === 'Identifier' && argument.callee.name === 'ValidationPipe')
                || (argument.type === 'Identifier' && argument.name === 'ValidationPipe');
        });
}
