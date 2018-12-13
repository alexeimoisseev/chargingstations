const { Router } = require('express');
const companies = require('./companies');

const router = new Router();

router.use('/companies', companies);

module.exports = router;
