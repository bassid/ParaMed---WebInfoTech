"use strict";

const async = require('async');
const mongoose = require('mongoose');
const incidents = mongoose.model('reports');
const logins = mongoose.model('login');

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
            res.sendStatus(404);
        }
        login(res, valid);
    });
};

function login(res, valid){
    if(valid){
        console.log("success");
        res.render('reports.ejs');
    }
    else{
        res.redirect('/error');
    }
}

module.exports.allIncidents =  function(req, res){
    incidents.find(function(err, report){
        if(!err){
            res.send(report);
        }
        else{
            console.log("Finding all incidents failed.");
            res.sendStatus(404);
        }
    });
};

module.exports.searchIncidents = function(req, res){
    if(req.body.incidentId){
        console.log("Searching database for incidents.");
        incidents.find({"incidentId": {"$regex": req.body.incidentId, "$options": "i"}}, function(err, report){
            if(!err){
                res.send(report);
            }
            else{
                console.log("Finding incidents failed.");
                res.sendStatus(404);
            }
        });
    }
    else{
        console.log("No search parameters specified. Loading all incidents.");
        incidents.find(function(err, report){
            if(!err){
                res.send(report);
            }
            else{
                console.log("Finding all incidents failed.");
                res.sendStatus(404);
            }
        });
    }
};

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

module.exports.createIncident = function(req, res){
    if(!(req.body.incidentId && req.body.time && req.body.date && req.body.incidentDescription &&
            req.body.incidentLocation && req.body.additionalInfo && req.body.photos && req.body.photos_base64
            && req.body.lat && req.body.lon && req.body.phoneNumber && req.body.lastUpdatedTime)){
        res.send("Invalid POST parameters");

    }
    else{
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
                        photos: req.body.photos,
                        photos_base64: req.body.photos_base64,
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
                    // res.send("already exists");
                    res.sendStatus(406);
                }
            }
            else{
                console.log("Validating unique ID failed.");
                res.sendStatus(404);
            }
        });
    }
};

module.exports.updateIncident = function(req, res){
    if(!(req.body.incidentId && req.body.time && req.body.date && req.body.incidentDescription &&
            req.body.incidentLocation && req.body.additionalInfo && req.body.photos && req.body.photos_base64
            && req.body.lat && req.body.lon)){
        res.send("Invalid POST parameters");
    }
    else{
        incidents.find({"incidentId": req.body.incidentId}, function(err, report){
            if(!err){
                if(!report[0]){
                    console.log("error: trying to update an incident ID that doesn't exist");
                }
                else{
                    var phoneNumber = report[0]['phoneNumber'];
                    var additionalInfo = report[0]['additionalInfo'];

                    if(req.body.phoneNumber != "") {
                        phoneNumber = req.body.phoneNumber;
                    }
                    if(req.body.additionalInfo != ""){
                        additionalInfo +=  req.body.additionalInfo;
                    }

                    // update incident
                    var updatedIncident = {
                        incidentId: report[0]['incidentId'],
                        phoneNumber: phoneNumber,
                        time: report[0]['time'],
                        date: report[0]['date'],
                        lastUpdatedTime: req.body.lastUpdatedTime,
                        incidentDescription: report[0]['incidentDescription'],
                        incidentLocation: report[0]['incidentLocation'],
                        additionalInfo: additionalInfo,
                        photos: req.body.photos,
                        photos_base64: req.body.photos_base64,
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
                res.sendStatus(404);
            }
        });
    }
}