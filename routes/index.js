const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homePageController');
const aboutController = require('../controllers/aboutController');
const signUpController = require('../controllers/signUpController');

router.get('/', homeController.showLandingPage);
router.get('/about', aboutController.showAboutPage);
router.get('/sign-up', signUpController.showSignUpPage);

module.exports = router;