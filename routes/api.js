const router = require('express').Router();
const apiController = require('../controllers/ApiController');

router.get('/landing-page', apiController.landingPage);
router.get('/project/:id', apiController.detailProject);

module.exports = router;