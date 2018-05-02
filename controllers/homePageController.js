var mongoose = require('mongoose');

module.exports.showPage = function(req, res){
    res.render('homepage.ejs');
};