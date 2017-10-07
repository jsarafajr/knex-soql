const client = require('./..');
const knex = require('knex')({ client });

test('Simple select', () => {
  const query = knex('Table').select(['yo', 'ha']);
  expect(query.toString()).toBe('select yo, ha from Table');
});

test('Where statement', () => {
  const query = knex('Table')
    .select(['Id', 'Name'])
    .where({
      Id: '12345',
    });

  expect(query.toString()).toBe('select Id, Name from Table where Id = \'12345\'');
});

test('Where statement with undefined value', () => {
  expect(() => {
    const query = knex('Table')
      .select(['Id', 'Name'])
      .where({
        Id: undefined,
      });

    query.toString();
  }).toThrow();
});

test('Subquery as a column', () => {
  const subquery = knex('Contact.OpportunityContactRoles')
    .select(['OpportunityContactRole.Opportunity.Id', 'OpportunityContactRole.Opportunity.Name']);

  const query = knex('Contact')
    .select([subquery])
    .where({
      Id: '12345',
    });

  expect(query.toString()).toBe('select (select OpportunityContactRole.Opportunity.Id, OpportunityContactRole.Opportunity.Name from Contact.OpportunityContactRoles) from Contact where Id = \'12345\'');
});

test('AND operator', () => {
  const query = knex('Table')
    .select(['Foo', 'Bar'])
    .where({
      Id: '12345',
      Bar: 'bar',
    });

  expect(query.toString()).toBe('select Foo, Bar from Table where Id = \'12345\' and Bar = \'bar\'');
});

test('OR operator', () => {
  const query = knex('Table')
    .select(['Foo', 'Bar'])
    .where({ Id: '12345' })
    .orWhere({ Bar: 'bar' });

  expect(query.toString()).toBe('select Foo, Bar from Table where Id = \'12345\' or (Bar = \'bar\')');
});

test('LIKE operator', () => {
  const query = knex('Table')
    .select(['Foo', 'Bar'])
    .orWhere('Foo', 'like', 'search%')
    .orWhere('Bar', 'like', 'search%')
    .orWhere('Baz', 'like', 'search%');

  expect(query.toString()).toBe('select Foo, Bar from Table where Foo like \'search%\' or Bar like \'search%\' or Baz like \'search%\'');
});

test('COUNT aggregation', () => {
  const query = knex('Table')
    .count()
    .where({ Id: '12345' });

  expect(query.toString()).toBe('select count() from Table where Id = \'12345\'');
});
