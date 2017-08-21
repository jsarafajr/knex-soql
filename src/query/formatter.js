const Formatter = require('knex/lib/formatter');

class FormatterSOQL extends Formatter {
  wrap(value) {
    if (typeof value === 'function') {
      return this.outputQuery(this.compileCallback(value), true);
    }

    const raw = this.unwrapRaw(value);
    if (raw) return raw;

    if (typeof value === 'number') return value;
    return this._wrapString(`${value}`);
  }

  outputQuery(compiled) {
    let sql = compiled.sql || '';

    if (sql) {
      if (compiled.method === 'select') {
        sql = `(${sql})`;
        if (compiled.as) return this.alias(sql, this.wrap(compiled.as));
      }
    }

    return sql;
  }
}

module.exports = FormatterSOQL;
