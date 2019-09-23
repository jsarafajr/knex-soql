# SOQL Dialect for Knex.js

[![Build Status](https://travis-ci.org/jsarafajr/knex-soql.svg?branch=master)](https://travis-ci.org/jsarafajr/knex-soql)
[![codecov](https://codecov.io/gh/jsarafajr/knex-soql/branch/master/graph/badge.svg)](https://codecov.io/gh/jsarafajr/knex-soql)
[![npm version](https://badge.fury.io/js/knex-soql.svg)](https://badge.fury.io/js/knex-soql) [![Greenkeeper badge](https://badges.greenkeeper.io/jsarafajr/knex-soql.svg)](https://greenkeeper.io/)

Knex.js dialect for building and executing Salesforce Queries (SOQL)

## Install

```bash
npm install knex-soql
```

## Usage

```js
const client = require('knex-soql');
const knex = require('knex')({
  client,
  connection: {
    loginUrl: 'https://test.salesforce.com',
    login: 'example@mail.com',
    password: 'supersecret'
  }
});

const contacts = await knex('Contact')
  .select(['Id', 'Name'])
  .where({ Name: 'example' })
  .orderBy('CreatedBy')
  .limit(10);
```

## Connection
All queries to Salesforce are performed using [jsforce](https://github.com/jsforce/jsforce) and all the connection properties passed down to jsforce.Connection constructor:
```js
const client = require('knex-soql');
const knex = require('knex')({
  client,
  connection: {
    oauth2: {
      clientId: '<your Salesforce OAuth2 client ID is here>',
      clientSecret: '<your Salesforce OAuth2 client secret is here>',
      redirectUri: '<your Salesforce OAuth2 redirect URI is here>'
    },
    instanceUrl: '<your Salesforce server URL (e.g. https://na1.salesforce.com) is here>',
    accessToken: '<your Salesforrce OAuth2 access token is here>',
    refreshToken: '<your Salesforce OAuth2 refresh token is here>'
  }
});
```

Or you can even provide jsforce.Connection instance configured by yourself to knex along with knex-soql client:
```js
const client = require('knex-soql');
const jsforce = require('jsforce');
const initKnex = require('knex');

const execute = async () => {
  const connection = new jsforce.Connection();
  await connection.login('example@mail.com', 'supersecret');

  const knex = initKnex({ client, connection });
  const contacts = await knex('Contact').select(['Id', 'Name']);
};

execute();
```

## Query Builder
You can use knex-soql to build SOQL queries without execution:
```js
const client = require('knex-soql');
const knex = require('knex')({ client });

const subquery = knex('Account.Contacts')
  .select(['Contact.Id', 'Contact.Name'])
  .orderBy('LastModifiedDate', 'desc')
  .limit(3);

const query = knex('Account')
  .select(['Id', 'Name', subquery])
  .where({ Id: '1337' });

console.log(query.toString());
/*
  select Id, Name, (
    select Contact.Id, Contact.Name
    from Account.Contacts
    order by LastModifiedDate desc
    limit 3
  )
  from Account
  where Id = '1337'
*/
```

## Credits
- [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_sosl_intro.htm)
- [Knex.js](http://knexjs.org/)
- [jsforce](https://github.com/jsforce/jsforce)

### Copyright and License

Copyright Yevhenii Baraniuk, 2017

[MIT Licence](LICENSE)
