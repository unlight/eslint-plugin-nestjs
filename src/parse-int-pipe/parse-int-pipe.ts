import { getDecoratorByName } from '../utils';
import { CallExpression } from 'estree';

export const message = {
    prefer: 'Prefer transform pipe `ParseIntPipe` in @Param decorator',
    transformed: 'Redundant coercing to number, parameter `{{name}}` must be a number',
};

export const parseIntPipe = {
    create(context): any {
        const parameters: Array<{ name: string, decorator: any }> = [];
        const checkAndReport = (argument) => {
            const param = parameters.find(p => p.name === argument.name);
            if (!param) {
                return;
            }
            if (param.decorator.transformed) {
                context.report(argument, message.transformed, { name: param.name });
            } else {
                context.report(argument, message.prefer);
            }
        };
        return {
            CallExpression: (node) => {
                if (isCoercingToNumber(node)) {
                    const [argument] = node.arguments;
                    checkAndReport(argument);
                }
            },
            UnaryExpression: (node) => {
                if (isCoercingToNumber(node)) {
                    checkAndReport(node.argument);
                }
            },
            FunctionExpression: (node) => {
                if (!Array.isArray(node.params)) {
                    return;
                }
                (node.params as any[])
                    .map(param => ({ param, decorator: getDecorator(param) }))
                    .filter(x => x.decorator)
                    .forEach(({ param, decorator }) => {
                        parameters.push({ name: param.name, decorator });
                    });
            }
        };
    }
};

function getDecorator(node) {
    // const decorator = (node.decorators || []).find(d => d.expression && d.expression.callee && d.expression.callee.name === 'Param');
    const decorator = getDecoratorByName(node, 'Param');
    if (!decorator) {
        return;
    }
    const [, expr] = (decorator.expression as CallExpression).arguments;
    return {
        transformed: Boolean(expr && expr.type === 'NewExpression' && expr.callee && expr.callee.type === 'Identifier' && expr.callee.name === 'ParseIntPipe'),
    };
}

function isCoercingToNumber(node: { callee?: any, prefix?: any, operator?: any, arguments?: any[] }) {
    if (node.callee) {
        if (node.callee.name === 'parseInt') {
            // const [, radix] = node.arguments;
            // if (radix && radix.type === 'Literal' && radix.value !== 10) {
            //     return false;
            // }
            return true;
        }
        if (node.callee.name === 'Number') {
            return true;
        }
        if (node.callee.object && node.callee.object.name === 'Number' && node.callee.property.name === 'parseInt') {
            return true;
        }
    }
    if (node.operator === '+' && node.prefix === true) {
        return true;
    }
    return false;
}
