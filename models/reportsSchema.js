const mongoose = require('mongoose');

const reportsSchema = mongoose.Schema(
    {
        "incidentId" : String,
        "time" : String,
        "incidentDescription" : String,
        "incidentLocation" : String,
        "additionalInfo" : String,
        "photos" : [String],
        "lat" : Number,
        "lon" : Number
    }
);

mongoose.model('reports', reportsSchema);
