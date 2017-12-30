export function getDecoratorByName(node, name: string) {
    return (node.decorators || []).find(d => d.expression && d.expression.callee && d.expression.callee.name === name);
}
