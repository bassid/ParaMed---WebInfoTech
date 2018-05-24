"use strict";

const async = require('async');
const mongoose = require('mongoose');
const incidents = mongoose.model('reports');
const logins = mongoose.model('login');

// Render the reports page if login credentials are valid.
module.exports.showPage = function(req, res){
    logins.findOne({"username": req.body.username}, function(err, user) {
        let valid = false;
        if (!err) {
            if (user) {
                if (user.password === req.body.password) {
                    console.log("Successful login!");
                    valid = true;
                }
            }
        }
        else {
            console.log("Login authentication failed.");
            res.send("Login authentication failed.");
        }
        login(res, valid);
    });
};

// Redirect to the home page.
module.exports.redirectHome = function(req, res){
    res.redirect('/');
};

// Render the reports page if login credentials are valid, otherwise redirect to the /error page.
function login(res, valid){
    if(valid){
        console.log("success");
        res.render('reports.ejs');
    }
    else{
        res.redirect('/error');
    }
}

// Retrieve all incidents from the database.
module.exports.allIncidents =  function(req, res){
    incidents.find(function(err, report){
        if(!err){
            res.send(report.reverse());
        }
        else{
            console.log("Finding all incidents failed.");
            res.send("Finding all incidents failed.");
        }
    });
};

// Search incidents from the database according to incidentID or phone number.
module.exports.searchIncidents = function(req, res){
    if(req.body.incidentId){
        console.log("Searching database for incidents.");
        incidents.find({$or: [{"incidentId": {"$regex": req.body.incidentId, "$options": "i"}},
                    {"phoneNumber": {"$regex": req.body.incidentId, "$options": "i"}}]},
            function(err, report){
            if(!err){
                res.send(report.reverse());
            }
            else{
                console.log("Finding incidents failed.");
                res.send("Finding incidents failed.");
            }
        });
    }
    else{
        console.log("No search parameters specified. Loading all incidents.");
        incidents.find(function(err, report){
            if(!err){
                res.send(report.reverse());
            }
            else{
                console.log("Finding all incidents failed.");
                res.send("Finding all incidents failed.");
            }
        });
    }
};

// Delete an incident from the database based on incidentID.
module.exports.deleteIncident = function(req, res) {
    incidents.findOneAndRemove({"incidentId": req.body.incidentId}).exec(function(err, item){
        if(err){
            return res.send("Error removing incident");
        }
        if(!item){
            return res.send("User ID" + req.body.incidentId + " not found");
        }
        res.send("ID" + req.body.incidentId + " deleted");
    });
};

// Create an incident and add it to the database.
module.exports.createIncident = function(req, res){
    // Check that all fields posted to the API endpoint are present and valid.
    if(req.body.incidentId == null || req.body.time == null || req.body.date == null ||
        req.body.incidentDescription == null || req.body.incidentLocation == null || req.body.additionalInfo == null ||
        req.body.photos_base64 == null || req.body.lat == null || req.body.lon == null ||
        req.body.phoneNumber == null || req.body.lastUpdatedTime == null){
        res.send("Invalid POST parameters");
    }
    else{
        // Create the incident and save it in the database.
        incidents.find({"incidentId": req.body.incidentId}, function(err, report){
            if(!err){
                if(!report[0]){
                    var newIncident = new incidents({
                        incidentId: req.body.incidentId,
                        phoneNumber: req.body.phoneNumber,
                        time: req.body.time,
                        date: req.body.date,
                        lastUpdatedTime: req.body.lastUpdatedTime,
                        incidentDescription: req.body.incidentDescription,
                        incidentLocation: req.body.incidentLocation,
                        additionalInfo: req.body.additionalInfo,
                        photos_base64: req.body.photos_base64,
                        ambulanceSent: false,
                        lat: req.body.lat,
                        lon: req.body.lon
                    });

                    newIncident.save(function(err){
                        if(err){
                            res.send("Error creating incident");
                        }
                        else{
                            res.send("Incident created");
                        }
                    });
                }
                else{
                    res.send("ID already exists");
                }
            }
            else{
                console.log("Validating unique ID failed.");
            }
        });
    }
};

// Find and update an existing incident in the database.
module.exports.updateIncident = function(req, res){
    // Check that the POST parameters are all present and valid.
    if(req.body.incidentId == null || req.body.time == null || req.body.date == null ||
        req.body.incidentDescription == null || req.body.incidentLocation == null || req.body.additionalInfo == null ||
        req.body.photos_base64 == null || req.body.lat == null || req.body.lon == null ||
        req.body.phoneNumber == null || req.body.lastUpdatedTime == null){
        res.send("Invalid POST parameters");
    }
    else{
        // Find and update the incident.
        incidents.find({"incidentId": req.body.incidentId}, function(err, report){
            if(!err){
                if(!report[0]){
                    console.log("error: trying to update an incident ID that doesn't exist");
                    res.send("error: trying to update an incident ID that doesn't exist");
                }
                else{
                    var phoneNumber = report[0]['phoneNumber'];
                    var additionalInfo = report[0]['additionalInfo'];

                    if(req.body.phoneNumber != "") {
                        phoneNumber = req.body.phoneNumber;
                    }
                    if(req.body.additionalInfo != ""){
                        if(report[0]['additionalInfo'] == ""){
                            additionalInfo += req.body.additionalInfo;
                        }
                        else{
                            additionalInfo += "<br>" + req.body.additionalInfo;
                        }
                    }

                    // Updated incident
                    var updatedIncident = {
                        incidentId: report[0]['incidentId'],
                        phoneNumber: phoneNumber,
                        time: report[0]['time'],
                        date: report[0]['date'],
                        lastUpdatedTime: req.body.lastUpdatedTime,
                        incidentDescription: report[0]['incidentDescription'],
                        incidentLocation: report[0]['incidentLocation'],
                        additionalInfo: additionalInfo,
                        photos_base64: req.body.photos_base64,
                        ambulanceSent: report[0]['ambulanceSent'],
                        lat: req.body.lat,
                        lon: req.body.lon
                    };

                    incidents.findOneAndUpdate({"incidentId": req.body.incidentId}, {$set: updatedIncident}, function(err, result){
                        if(err){
                            res.send(err);
                        }
                        else{
                            res.send(result);
                        }
                    })
                }
            }
            else{
                console.log("Validating unique ID failed.");
                res.send("Validating unique ID failed.");
            }
        });
    }
}

// Update the database to reflect that an ambulance has been sent.
module.exports.sendAmbulance = function(req, res){
    if(req.body.incidentId == null){
        res.send("Invalid POST parameters");
    }
    else{
        // Find and update incident
        incidents.find({"incidentId": req.body.incidentId}, function(err, report){
            if(!err){
                if(!report[0]){
                    console.log("error: trying to send ambulance to an incident ID that doesn't exist");
                    res.send("error: trying to send ambulance to an incident ID that doesn't exist");
                }
                else{
                    if(report[0]['ambulanceSent']){
                        console.log("Sending updated info");
                        res.send("Error: Ambulance already sent");
                    }
                    else{
                        // Updated incident
                        var updatedIncident = {
                            incidentId: report[0]['incidentId'],
                            phoneNumber: report[0]['phoneNumber'],
                            time: report[0]['time'],
                            date: report[0]['date'],
                            lastUpdatedTime: report[0]['lastUpdatedTime'],
                            incidentDescription: report[0]['incidentDescription'],
                            incidentLocation: report[0]['incidentLocation'],
                            additionalInfo: report[0]['additionalInfo'],
                            photos_base64: report[0]['photos_base64'],
                            ambulanceSent: true,
                            lat: report[0]['lat'],
                            lon: report[0]['lon']
                        };

                        incidents.findOneAndUpdate({"incidentId": req.body.incidentId}, {$set: updatedIncident}, function(err, result){
                            if(err){
                                res.send(err);
                            }
                            else{
                                res.send("Ambulance status updated to ID" + req.body.incidentId);
                            }
                        })
                    }
                }
            }
            else{
                console.log("Validating unique ID failed.");
                res.send("Validating unique ID failed.");
            }
        });
    }
}