const mongoose = require('mongoose');

const reportsSchema = mongoose.Schema(
    {
        "incidentId" : String,
        "phoneNumber" : String,
        "time" : String,
        "date" : String,
        "lastUpdatedTime" : String
        "incidentDescription" : String,
        "incidentLocation" : String,
        "additionalInfo" : String,
        "photos" : [String],
        "photos_base64" : [String],
        "lat" : Number,
        "lon" : Number
    }
);

mongoose.model('reports', reportsSchema);
