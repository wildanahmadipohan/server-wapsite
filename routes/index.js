var express = require('express');
var router = express.Router();

const authController = require('../controllers/AuthController');

/* GET home page. */
router.get('/', authController.viewLogin);
router.post('/', authController.actionLogin);
router.get('/logout', authController.actionLogout);

module.exports = router;
