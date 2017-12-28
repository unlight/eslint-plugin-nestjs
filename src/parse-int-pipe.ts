export const message = {
    prefer: 'Prefer transform pipe `ParseIntPipe` in @Param decorator',
    transformed: 'Redundant coercing to number, parameter `{{name}}` must be a number',
};
export const parseIntPipe = {
    create(context): any {
        const parameters: Array<{ name: string, transformed: boolean }> = [];
        const isOurParameter = (argument) => parameters.some(p => p.name === argument.name);
        const reportMessage = (argument) => {
            const p = parameters.find(p => p.name === argument.name);
            if (p.transformed) {
                context.report(argument, message.transformed, { name: p.name });
            } else {
                context.report(argument, message.prefer);
            }
        };
        return {
            CallExpression: (node) => {
                if (isCoersingToNumber(node)) {
                    const [argument] = node.arguments;
                    if (isOurParameter(argument)) {
                        context.report({ node, message: message.prefer, data: {} });
                    }
                }
            },
            UnaryExpression: (node) => {
                if (isCoersingToNumber(node)) {
                    const argument = node.argument;
                    if (isOurParameter(argument)) {
                        reportMessage(argument);
                    }
                }
            },
            FunctionExpression: (node) => {
                if (!Array.isArray(node.params)) {
                    return;
                }
                node.params.forEach(param => {
                    const decorator = getParamDecorator(param);
                    if (decorator) {
                        parameters.push({ name: param.name, transformed: hasNewParseIntPipe(decorator) });
                    }
                });
            }
        };
    }
};

function getParamDecorator(node) {
    return (node.decorators || []).find(d => d.expression && d.expression.callee && d.expression.callee.name === 'Param');
}

function hasNewParseIntPipe(decorator) {
    const [, d] = decorator.expression.arguments;
    return Boolean(d && d.type === 'NewExpression' && d.callee && d.callee.name === 'ParseIntPipe');
}

function isCoersingToNumber(node: { callee?: any, prefix?: any, operator?: any }) {
    if (node.callee) {
        if (node.callee.name === 'parseInt') {
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
