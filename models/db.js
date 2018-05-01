var mongoose = require('mongoose');

mongoose.connect('mongodb://rserraglio:info30005@ds141796.mlab.com:41796/reports', function(err){
    if(!err) {
        console.log('Mongo Connected');
    }
    else {
        console.log('Mongo Failed');
    }
});

require('./reportsSchema.js');
require('./loginSchema.js');

// Testing access to the database
/*
activeReports.find({}, function (err, rep) {
    if (err) {
        console.log(err);
        res.status(500).send();
    }
    else {
        for(var i = 0; i < rep.length; i++) {
            console.log(rep[i].incidentId);
            console.log(rep[i].incidentTime); // This is undefined?????????
            console.log(rep[i].incidentDescription);
            console.log(rep[i].incidentLocation);
            console.log(rep[i].additionalInfo);
            console.log(rep[i].lat);
            console.log(rep[i].lon);
            console.log("\n");
        }
    }
});
*/