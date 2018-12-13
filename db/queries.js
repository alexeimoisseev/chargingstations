const createCompanies = `CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NOT NULL,
  parent INT DEFAULT NULL,
  lft INT NOT NULL,
  rgt INT NOT NULL
);
`;

const createStations = `CREATE TABLE IF NOT EXISTS stations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NOT NULL,
  company INT NOT NULL
);`;


/**
 * `companies` table is made as **Nested set**.
 * Inspired by an awesome article and tutorial:
 * http://mikehillyer.com/articles/managing-hierarchical-data-in-mysql/
 *
 * sqlite doesn't support variables. This is why we create
 * temporary table and use it as variable.
 * It will help to avoid extra queries for `lft` field of parent company.
 *
 * Inserting a company must be done as transaction.
 * `better-sqlite3` supports transactions only with separate commands.
 * This is why this query is stored as an array.
 */
const insertCompany = [
  'CREATE TEMP TABLE tmp (lft INT);',
  `INSERT INTO tmp (lft) VALUES (
    coalesce((SELECT lft FROM companies WHERE id = $parent), 1)
  );`,
  'UPDATE companies SET rgt = rgt + 2 WHERE rgt > (SELECT lft FROM tmp LIMIT 1);',
  'UPDATE companies SET lft = lft + 2 WHERE lft > (SELECT lft FROM tmp LIMIT 1);',
  `INSERT INTO companies (name, parent, lft, rgt) VALUES (
    $name,
    $parent,
    (SELECT lft FROM tmp LIMIT 1) + 1,
    (SELECT lft FROM tmp LIMIT 1) + 2
  );`,
  'DROP TABLE tmp;',
];

const insertStation = `INSERT INTO stations
  (name, company)
  VALUES
  ($name, $company)
`;

const listStations = `SELECT id, name FROM STATIONS WHERE company IN (
  SELECT node.id FROM
    companies AS node,
    companies AS parent
    WHERE node.lft BETWEEN parent.lft AND parent.rgt
    AND parent.id = $company
)`;

const listCompanies = `SELECT
  node.id,
  node.name,
  count(parent.name) - 1 AS depth
  FROM companies AS node, companies AS parent
  WHERE node.lft BETWEEN parent.lft AND parent.rgt
  GROUP BY node.id
  ORDER BY node.lft
`;

module.exports = {
  createCompanies,
  createStations,
  insertCompany,
  insertStation,
  listCompanies,
  listStations,
};
