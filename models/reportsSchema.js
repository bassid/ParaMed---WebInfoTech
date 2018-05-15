const mongoose = require('mongoose');

const reportsSchema = mongoose.Schema(
    {
        "incidentId" : String,
        "phoneNumber" : String,
        "time" : String,
        "date" : String,
        "lastUpdatedTime" : String,
        "incidentDescription" : String,
        "incidentLocation" : String,
        "additionalInfo" : String,
        "photos_base64" : [String],
        "ambulanceSent" : Boolean,
        "lat" : Number,
        "lon" : Number
    }
);

mongoose.model('reports', reportsSchema);
