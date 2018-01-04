# Enforce using `ParseIntPipe` transform pipe (parse-int-pipe)
Pipes can overtake the validation responsibility, since it's possible to throw an exception when the data isn't correct.

## Rule Details

The following patterns are considered warnings (**fail**):

```ts
@Get(':id')
async findOne( @Param('id') id) {
  id = Number.parseInt(id);
  return await this.catsService.findOne(id);
}
```

The following patterns are not warnings (**pass**):

```ts
@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return await this.catsService.findOne(id);
}
```

## When Not To Use It
When you need convert incoming parameter to number with not decimal radix.
