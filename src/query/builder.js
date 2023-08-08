const Builder = require('knex/lib/query/querybuilder');

class BuilderSOQL extends Builder {
  count(column) {
    return this._aggregate('count', column || '');
  }
}

module.exports = BuilderSOQL;
