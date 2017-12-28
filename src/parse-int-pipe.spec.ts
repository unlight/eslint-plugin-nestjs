import { parseIntPipe, message } from './parse-int-pipe';
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

ruleTester.run('parse-int-pipe', parseIntPipe, {
    invalid: [
        { code: `class { cat( @Param('any') id) { var n = parseInt(id) } }`, errors: [{ message: message.prefer }] },
        { code: `class { cat( @Param('any') id) { var n = Number.parseInt(id, 10) } }`, errors: [{ message: message.prefer }] },
        { code: `class { cat( @Param('any') id) { var n = Number(id) } }`, errors: [{ message: message.prefer }] },
        { code: `class { cat( @Param('any') id) { var n = +(id) } }`, errors: [{ message: message.prefer }] },
        { code: `class { cat( @Param('any', new ParseIntPipe()) id) { +(id) } }`, errors: [{ message: message.transformed.replace('{{name}}', 'id') }] },
    ],
    valid: [
        `class { id() { } }`,
        `class { id(id: any) { } }`,
        `class { id( @Param('id') id) { } }`,
        `class { id( @Param('id') id, @Val() val) { parseInt(val) } }`,
        `class { id( @Param('any', new ParseIntPipe()) id) { } }`,
        // `class { cat( @Param('any') id) { var x = parseInt(id, 2) } }`
    ],
});
