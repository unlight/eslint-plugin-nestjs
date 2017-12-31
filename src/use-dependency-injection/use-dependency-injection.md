# Enforce using Dependency Injection (use-dependency-injection)
Stick dependency inversion principle, the dependencies must be provided through a class constructor.

## Rule Details

The following patterns are considered warnings (**fail**):

```ts
@Component()
export class CatService {
    logger;
    constructor() {
        this.logger = new Logger();
    }
}
```

```ts
@Component()
export class CatService {
    private logger = require('bunyan');
}
```

```ts
const bunyan = require('bunyan');
@Component()
export class CatService {
    private logger = bunyan;
}
```

The following patterns are not warnings (**pass**):

```ts
@Component()
export class CatService {
    constructor(
        private logger: Logger
    ) { }
}
```

```ts
@Component()
export class CatService {
    private logger;
    constructor(
        logger: Logger
    ) {
        this.logger = logger;
    }
}
```

## Further Reading
1. [Dependency inversion principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
2. [Utility classes are evil?](https://stackoverflow.com/questions/3340032/utility-classes-are-evil)
