const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homePageController');
const aboutController = require('../controllers/aboutController');
const signUpController = require('../controllers/signUpController');
const reportsController = require('../controllers/reportsController');

router.get('/', homeController.showPage);
router.get('/error', homeController.displayError);
router.get('/about', aboutController.showPage);
router.get('/sign-up', signUpController.showPage);
router.post('/database/all', reportsController.allIncidents);
router.post('/database/search', reportsController.searchIncidents);
router.post('/database/delete', reportsController.deleteIncident);
router.post('/database/create', reportsController.createIncident);
router.post('/reports', reportsController.showPage);
router.post('/database/update', reportsController.updateIncident);
router.post('/database/sendAmbulance', reportsController.sendAmbulance);

module.exports = router;