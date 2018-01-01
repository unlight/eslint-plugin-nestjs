import { CallExpression, Expression } from 'estree';

export type Decorator = {
    expression: Expression;
};

export function getDecoratorByName(node: any, name: string): Decorator | undefined {
    const result: Decorator = (node.decorators || []).find(d => {
        const expression = d.expression && d.expression.type === 'CallExpression' && d.expression as CallExpression;
        return expression && expression.callee.type === 'Identifier' && expression.callee.name === name;
    });
    return result;
}
