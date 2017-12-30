import { useDependencyInjection, message } from './use-dependency-injection';
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

ruleTester.run('use-dependency-injection', useDependencyInjection, {
    invalid: [
        { code: `@Component() export class { constructor() { this.logger = new Logger() } }`, errors: [{ message }] },
        { code: `@Component() export class { private logger = new Logger() }`, errors: [{ message }] },
        { code: `@Component() export class { private logger = require('bunyan') }`, errors: [{ message }] },
        { code: `const x, bunyan = require('bunyan'); @Component() class { private logger = bunyan }`, errors: [{ message }] },
        { code: `import * as bunyan from 'bunyan'; @Component() class { private logger = bunyan }`, errors: [{ message }] },
        { code: `import bunyan from 'bunyan'; @Component() class { private logger = bunyan }`, errors: [{ message }] },
        { code: `import { bunyan } from 'bunyan'; @Component() class { private logger = bunyan }`, errors: [{ message }] },
        { code: `import bunyan = require('bunyanMod'); @Component() class { private logger = bunyan }`, errors: [{ message }] },
    ],
    valid: [
        { code: `@Component() export class { constructor(private logger: Logger) { } }` },
        { code: `@Component() export class CatService { private logger; constructor(logger: Logger) { this.logger = logger } }` },
    ],
});
