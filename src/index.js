const Client = require('knex/lib/client');
const QueryCompiler = require('./query/compiler');
const QueryBuilder = require('./query/builder');
const Formatter = require('./query/formatter');

class ClientSOQL extends Client {
  get dialect() {
    return 'soql';
  }

  wrapIdentifier(value) {
    return value;
  }

  formatter() {
    return new Formatter(this);
  }

  queryCompiler(...args) {
    return new QueryCompiler(this, ...args);
  }

  queryBuilder() {
    return new QueryBuilder(this);
  }
}

module.exports = ClientSOQL;
