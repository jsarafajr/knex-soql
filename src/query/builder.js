const Builder = require('knex/src/query/builder');

class BuilderSOQL extends Builder {
  count(column) {
    return this._aggregate('count', column || '');
  }
}

module.exports = BuilderSOQL;
