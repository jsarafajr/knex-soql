const Builder = require('knex/lib/query/builder');

class BuilderSOQL extends Builder {
  count(column) {
    return this._aggregate('count', column || '');
  }
}

module.exports = BuilderSOQL;
