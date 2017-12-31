import { deprecatedApiModules, message } from './deprecated-api-modules';
const { RuleTester } = require('eslint');
const ruleTester = new RuleTester({
    parser: 'typescript-eslint-parser'
});
RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {},
    },
});

ruleTester.run('deprecated-api-modules', deprecatedApiModules, {
    invalid: [
        { code: `@Module({ modules: [DatabaseModule] }) export class CatModule { }`, errors: [{ message, column: 11 }] },
    ],
    valid: [
        { code: `@Module({ imports: [DatabaseModule] }) export class CatModule { }`, errors: [{}] },
    ],
});
