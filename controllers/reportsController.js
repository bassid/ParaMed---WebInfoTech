const db = require('../models/exampleIncidents.js');
const exampleIncidents = db.incidents;

var showPage = function(req, res) {
    res.render('reports.ejs');
};

var allIncidents = function(req, res){
    res.send(exampleIncidents);
}

module.exports.showPage = showPage
module.exports.allIncidents = allIncidents;