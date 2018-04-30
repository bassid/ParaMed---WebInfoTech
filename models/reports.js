const mongoose = require('mongoose');

const reportsSchema = mongoose.Schema(
    {
        "incidentId" : String,
        "incidentTime" : String,
        "incidentDescription" : String,
        "incidentLocation" : String,
        "additionalInfo" : String,
        "photos" : [String],
        "lat" : Number,
        "lon" : Number
    }
);

module.exports = mongoose.model('reports', reportsSchema);
