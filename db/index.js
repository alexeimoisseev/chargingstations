const Sqlite = require('better-sqlite3')
const queries = require('./queries');

function connect() {
  const dbpath = './virta.db';
  const db = new Sqlite(dbpath);
  return db;
}

function run(query, params = {}) {
  const db = connect();
  db.prepare(query).run(params);
  db.close();
}

async function get(query, params = {}) {
  const db = connect();
  return new Promise((resolve) => {
    const result = db.prepare(query).all(params);
    resolve(result);
    db.close();
  });
}

async function transaction(query, params) {
  const db = connect();
  query.map(line => {
    db.prepare(line).run(params);
  });
  db.close();
}

module.exports = {
  get,
  queries,
  run,
  transaction,
};
