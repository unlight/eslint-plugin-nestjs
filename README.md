# eslint-plugin-nestjs
ESLint rules for [nestjs](https://github.com/nestjs/nest) framework

## INSTALL
```
npm install --save-dev eslint-plugin-nestjs
```

## USAGE
Configure it in [your configuration file](https://eslint.org/docs/user-guide/configuring):  
1. Add to `plugins` section:
```
nestjs
```
2. Add to `extends` section (optional):
```
plugin:nestjs/recommended
```
3. [Configure rules](https://eslint.org/docs/user-guide/configuring#configuring-rules)

## RULES
* [nestjs/parse-int-pipe](src/parse-int-pipe/parse-int-pipe.md) — Usage of transform pipe `ParseIntPipe` for `@Param()` decorator
* [nestjs/deprecated-api-modules](src/deprecated-api-modules/deprecated-api-modules.md) — Disallow usage of the deprecated api (import modules)
* [nestjs/use-dependency-injection](src/use-dependency-injection.md) — Stick dependency inversion principle, the dependencies are provided through a class constructor

## TODO
* rule: inject @Res() but not using send or json

## USEFUL LINKS
* https://astexplorer.net/

## CHANGELOG
See [CHANGELOG.md](CHANGELOG.md)
