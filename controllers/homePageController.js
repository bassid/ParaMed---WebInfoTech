module.exports.showLandingPage = function(req, res) {
    res.render('index', { title: "ParaMed" });
};