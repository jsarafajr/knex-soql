const initKnex = require('knex');
const jsforce = require('jsforce');
const client = require('./..');

test('Knex client without connection', async () => {
  const knex = initKnex({ client });

  await expect(knex('Table').select(['Id', 'Name']))
    .rejects
    .toEqual(new Error('connection not provided'));
});

test('Knex client with connection without login/password', async () => {
  const knex = initKnex({
    client,
    connection: {
      foo: 'bar',
    },
  });

  await expect(knex('Table').select(['Id', 'Name']))
    .rejects
    .toEqual(new Error('login/password or authorized jsforce.Connection instance should be provided'));
});

test('Knex client with logged jsforce.Connection instance', async () => {
  const connection = new jsforce.Connection();

  connection.accessToken = 'DUMMY';
  connection.query = jest.fn().mockReturnValue(Promise.resolve({ records: ['foo', 'bar'] }));

  const knex = initKnex({
    client,
    connection,
  });

  expect(knex.client._connection).toBe(connection);

  await expect(knex('Table').select(['Id', 'Name']))
    .resolves
    .toEqual(['foo', 'bar']);

  expect(connection.query.mock.calls.length).toBe(1);
  expect(connection.query.mock.calls[0]).toEqual(['select Id, Name from Table']);
});

test('Knex client with connection login/password', async () => {
  const knex = initKnex({
    client,
    connection: {
      login: 'LOGIN',
      password: 'PASSWORD',
    },
  });

  knex.client._connection.login = jest.fn().mockReturnValue(Promise.resolve());
  knex.client._connection.query = jest.fn().mockReturnValue(Promise.resolve({ records: ['foo', 'bar'] }));

  expect(knex.client._connection).toBeInstanceOf(jsforce.Connection);

  await expect(knex('Table').select(['Id', 'Name']))
    .resolves
    .toEqual(['foo', 'bar']);

  expect(knex.client._connection.login.mock.calls.length).toBe(1);
  expect(knex.client._connection.login.mock.calls[0]).toEqual(['LOGIN', 'PASSWORD']);

  expect(knex.client._connection.query.mock.calls.length).toBe(1);
  expect(knex.client._connection.query.mock.calls[0]).toEqual(['select Id, Name from Table']);
});

test('Knex client with connection login/password', async () => {
  const knex = initKnex({
    client,
    connection: {
      accessToken: 'DUMMY',
    },
  });

  knex.client._connection.query = jest.fn().mockReturnValue(Promise.resolve({ records: ['foo', 'bar'] }));

  expect(knex.client._connection).toBeInstanceOf(jsforce.Connection);
  expect(knex.client._connection.accessToken).toBe('DUMMY');

  await expect(knex('Table').select(['Id', 'Name']))
    .resolves
    .toEqual(['foo', 'bar']);

  expect(knex.client._connection.query.mock.calls.length).toBe(1);
  expect(knex.client._connection.query.mock.calls[0]).toEqual(['select Id, Name from Table']);
});
