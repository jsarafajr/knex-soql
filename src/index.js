const Client = require('knex/lib/client');
const QueryCompiler = require('./query/compiler');
const QueryBuilder = require('./query/builder');
const Formatter = require('./query/formatter');

class Client_SOQL extends Client {
  constructor(config) {
    super(config);
  }

  get dialect() {
    return 'soql';
  }

  get driverName() {
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
    return new QueryBuilder(this)
  }
}

module.exports = Client_SOQL;
