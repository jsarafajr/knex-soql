# SOQL Dialect for Knex.js

- [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_sosl_intro.htm)
- [Knex.js](http://knexjs.org/)

## Install

```bash
npm install knex-soql
```

## Usage

```js
const client = require('knex-soql');
const knex = require('knex')({ client });

const soql = knex('Contact')
  .select(['Id', 'Name'])
  .where({ Name: 'example' })
  .orderBy('CreatedBy')
  .limit(10);

console.log(soql.toString());
// select Id, Name from Contact where Name = 'example' order by CreatedBy asc limit 10
```

## TODO

- Add warnings and errors when trying to use connection
- Add tests for orderBy, groupBy, Limit

### Copyright and License

Copyright Yevhenii Baraniuk, 2017

[MIT Licence](LICENSE)
