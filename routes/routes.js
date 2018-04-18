const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homePageController');
const aboutController = require('../controllers/aboutController');
const signUpController = require('../controllers/signUpController');
const reportsController = require('../controllers/reportsController');

router.get('/', homeController.showPage);
router.get('/about', aboutController.showPage);
router.get('/sign-up', signUpController.showPage);
router.get('/reports', reportsController.showPage);

module.exports = router;