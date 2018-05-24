var mongoose = require('mongoose');

// Render the homepage.
module.exports.showPage = function(req, res){
    res.render('homepage.ejs');
};

// Display an error if login credentials are invalid.
module.exports.displayError = function(req, res) {
    res.render('homepage.ejs', { invalidLogin : "true"});
}
