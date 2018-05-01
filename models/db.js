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