# Use `imports` property for the list of imported modules (deprecated-api-modules)
Disallow usage of the deprecated api (import modules).

## Rule Details

The following patterns are considered warnings (**fail**):
```ts
@Module({
  modules: [DatabaseModule]
})
export class CatModule { }
```

The following patterns are not warnings (**pass**):
```ts
@Module({
  imports: [DatabaseModule]
})
export class CatModule { }
```

## When Not To Use It
If you are using old version of nestjs.

## Further Reading
* [NestJs Documentation - Modules](https://docs.nestjs.com/modules)
