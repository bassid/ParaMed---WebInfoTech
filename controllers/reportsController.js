"use strict";

var mongoose = require('mongoose');
var incidents = mongoose.model('reports');

module.exports.showPage = function(req, res) {
    res.render('reports.ejs');
};

module.exports.allIncidents =  function(req, res){
    incidents.find(function(err, report){
        if(!err){
            res.send(report);
        }
        else{
            console.log("Finding all incidents failed.")
            res.sendStatus(404);
        }
    });
};

module.exports.searchIncidents = function(req, res){
    if(req.body.id){
        console.log("Searching database for incidents.");
        incidents.find({"incidentId": {"$regex": req.body.id, "$options": "i"}}, function(err, report){
            if(!err){
                res.send(report);
            }
            else{
                console.log("Finding incidents failed.")
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
                console.log("Finding all incidents failed.")
                res.sendStatus(404);
            }
        });
    }
};

module.exports.deleteIncident = function(req, res) {
    incidents.findOneAndRemove({"incidentId": req.body.id}).exec(function(err, item){
        if(err){
            return res.send("Error removing incident");
        }
        if(!item){
            return res.send("User ID" + req.body.id + " not found");
        }
        res.send("ID" + req.body.id + " deleted");
    });
};

module.exports.createIncident = function(req, res){
    if(!(req.body.id && req.body.time && req.body.incidentDescription && req.body.incidentLocation &&
        req.body.additionalInfo && req.body.photos && req.body.lat && req.body.lon)){
        res.send("Invalid POST parameters");
    }
    else{
        var newIncident = new incidents({
            incidentId: req.body.id,
            time: req.body.time,
            incidentDescription: req.body.incidentDescription,
            incidentLocation: req.body.incidentLocation,
            additionalInfo: req.body.additionalInfo,
            photos: req.body.photos,
            lat: req.body.lat,
            lon: req.body.lon
        })

        newIncident.save(function(err){
            if(err){
                res.send("Error creating incident");
            }
            else{
                res.send("Incident created");
            }
        })
    }
}