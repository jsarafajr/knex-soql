const QueryCompiler = require('knex/lib/query/compiler');

class QueryCompilerSOQL extends QueryCompiler {
  columns() {
    const columns = this.grouped.columns || [];
    const sql = [];

    columns.forEach(col => {
      if (col.type === 'aggregate') {
        sql.push(this.aggregate(col));
      } else if (col.value && col.value.length) {
        sql.push(this.formatter.columnize(col.value));
      }
    });

    if (sql.length === 0) throw new Error('columns required in select statement');

    return `select ${sql.join(', ')} from ${this.tableName}`;
  }
}

module.exports = QueryCompilerSOQL;
