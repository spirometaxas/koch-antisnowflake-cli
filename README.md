# koch-antisnowflake-cli
Print the Koch Anti-Snowflake to the console!

## Usage
### Via `npx`:
```
$ npx koch-antisnowflake-cli <n>
$ npx koch-antisnowflake-cli <n> <size>
```

### Via Global Install
```
$ npm install --global koch-antisnowflake-cli
$ koch-antisnowflake-cli <n>
$ koch-antisnowflake-cli <n> <size>
```

### Via Import
```
$ npm install koch-antisnowflake-cli
```
then:
```
const koch_antisnowflake = require('koch-antisnowflake-cli');
console.log(koch_antisnowflake.create(<n>, <size>));
```