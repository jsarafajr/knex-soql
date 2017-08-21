const Builder = require('knex/lib/query/builder');

class Builder_SOQL extends Builder {
  constructor(client) {
    super(client);
  }

  count(column) {
    return this._aggregate('count', column || '');
  }
}

module.exports = Builder_SOQL;
