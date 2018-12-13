/**
 * Run this to populate database with fake initial data.
 */
const db = require('./db');
const {
  createCompanies,
  createStations,
  insertCompany,
  insertStation,
} = db.queries;

(async () => {
  await db.run(createCompanies);
  await db.run(createStations);
  await db.transaction(insertCompany, {parent: null, name: 'Energy Utility Global'});
  await db.transaction(insertCompany, {parent: 1, name: 'Energy Utility Finland'});
  await db.transaction(insertCompany, {parent: 2, name: 'Energy Utility Helsinki'});
  await db.transaction(insertCompany, {parent: 1, name: 'Energy Utility Sweden'});
  await db.run(insertStation, {company: 4, name: 'Stockholm station'});
  await db.run(insertStation, {company: 2, name: 'Oulu Station'});
  await db.run(insertStation, {company: 3, name: 'Töölöö station'});
  await db.run(insertStation, {company: 3, name: 'Kaisaniemi station'});
})();
