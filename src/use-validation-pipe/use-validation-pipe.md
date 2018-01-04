# Use pipe `ValidationPipe` for data validation (use-validation-pipe)
Pipes can overtake the validation responsibility, since it's possible to throw an exception when the data isn't correct.

## Rule Details

The following patterns are considered warnings (**fail**):

```ts
class CatController {
    @Post()
    async create(@Body() createCatDto: CreateCatDto) { }
}
```

The following patterns are not warnings (**pass**):

```ts
@UsePipes(new ValidationPipe())
class CatController {
    @Post()
    async create(@Body() createCatDto: CreateCatDto) { }
}
```

```ts
class CatController {
    @Post()
    async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) { }
}
```

```ts
class { 
    @Post() 
    async create(@Body() createCatDto: any) {  } 
}
```

## Further Reading
[Pipes](https://docs.nestjs.com/pipes)
