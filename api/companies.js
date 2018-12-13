const { Router } = require('express');
const {
  get,
  queries: {
    listCompanies,
    listStations,
    insertCompany,
    insertStation,
  },
  run,
  transaction,
} = require('../db');

const router = new Router();

router.get('/', async (req, res) => {
  const companies = await get(listCompanies);
  res.send(companies);
});

router.post('/', async (req, res) => {
  const { name, parent = null } = req.body;
  if (!name) {
    res.status(400).send('Name is required');
    return;
  }
  await transaction(insertCompany, {
    name,
    parent,
  });
  res.send('OK');
});

router.get('/:company', async (req, res) => {
  const { company: company } = req.params;
  const stations = await get(listStations, {
    company,
  });
  res.send(stations);
});

router.post('/:company', async (req, res) => {
  const { company } = req.params;
  const { name } = req.body;
  if (!name) {
    res.status(400).send('Name is required');
    return;
  }
  run(insertStation, { company, name });
  res.send('OK');
});


module.exports = router;
