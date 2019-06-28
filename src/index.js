const Client = require('knex/src/client');
const { makeEscape } = require('knex/src/query/string');
const QueryCompiler = require('./query/compiler');
const QueryBuilder = require('./query/builder');
const Formatter = require('./query/formatter');

const Promise = require('bluebird');
const { Connection } = require('jsforce');
const { uniqueId, pick } = require('lodash');

class ClientSOQL extends Client {
  constructor(options = {}) {
    super({ client: 'soql' });
    if (options.connection) {
      if (options.connection instanceof Connection) {
        this._connection = options.connection;
      } else {
        this._connection = new Connection(options.connection);
        this._credentials = pick(options.connection, ['login', 'password']);
      }
    }
  }

  get dialect() {
    return 'soql';
  }

  get canCancelQuery() {
    return false;
  }

  wrapIdentifier(value) {
    return value;
  }

  formatter(builder) {
    return new Formatter(this, builder);
  }

  queryCompiler(...args) {
    return new QueryCompiler(this, ...args);
  }

  queryBuilder() {
    return new QueryBuilder(this);
  }

  acquireConnection() {
    return Promise.resolve()
      .then(() => {
        if (!this._connection) {
          throw new Error('connection not provided');
        }
        if (!this._connection.accessToken) {
          const { login, password } = this._credentials || {};
          if (!login || !password) {
            throw new Error('login/password or authorized jsforce.Connection instance should be provided');
          }
          return this._connection.login(login, password);
        }
        return Promise.resolve();
      })
      .then(() => {
        this._connection.__knexUid = uniqueId('__knexUid');
        return this._connection;
      });
  }

  releaseConnection() {
    return Promise.resolve();
  }

  query(connection, obj) {
    return connection.query(obj.sql).then(response => Object.assign({}, obj, { response }));
  }

  processResponse(obj) {
    if (obj === null) return [];

    switch (obj.method) {
      case 'select':
        return obj.response.records;
      default:
        return obj.response;
    }
  }

  _escapeBinding(...args) {
    return makeEscape()(...args);
  }
}

module.exports = ClientSOQL;
