import { useValidationPipe, message } from './use-validation-pipe';
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

ruleTester.run('use-validation-pipe', useValidationPipe, {
    invalid: [
        { code: `@Controller('example') export class ExampleController { @Post() createOne(@Body() item: MyType) { } }`, errors: [{ message }] },
        { code: `class { @Post() async create(@Body() createCatDto: CreateCatDto) { } }`, errors: [{ message }] },
    ],
    valid: [
        { code: `class { @Post() @UsePipes(new ValidationPipe()) async create(@Body() createCatDto: CreateCatDto) { } }` },
        { code: `class { @Post() @UsePipes(new OtherPipe(), new ValidationPipe()) async create(@Body() createCatDto: CreateCatDto) { } }` },
        { code: `class { @Post() async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) { } }` },
        { code: `@UsePipes(new ValidationPipe()) class { @Post() async create(@Body() createCatDto: CreateCatDto) { } }` },
        { code: `class { @Post() async create(@Body() createCatDto: any) { } }` },
        { code: `class { @Post() async create(@Body() createCatDto) { } }` },
        { code: `@UsePipes(ValidationPipe) class { @Post() async create(@Body() createCatDto: CreateCatDto) { } }` },
    ],
});
