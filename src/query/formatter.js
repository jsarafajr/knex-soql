const Formatter = require('knex/src/formatter');

class FormatterSOQL extends Formatter {
  wrap(value) {
    if (typeof value === 'function') {
      return this.outputQuery(this.compileCallback(value), true);
    }

    const raw = this.unwrapRaw(value);
    if (raw) return raw;

    if (typeof value === 'number') return value;
    // save compatibility with older knex.js versions
    return (this.wrapString || this._wrapString).call(this, `${value}`);
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
