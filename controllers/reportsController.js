"use strict";

const db = require('../models/exampleIncidents.js');
const exampleIncidents = db.incidents;

module.exports.showPage = function(req, res) {
    res.render('reports.ejs');
};

module.exports.allIncidents =  function(req, res){
    res.send(exampleIncidents);
};


var activeReports = require('../models/reportsSchema.js');


function loadReports() {
    // Alert to test if loadReports is being called successfully
    alert("Load reports function executing");

    // TEST for creating new divs
    var output = document.getElementById('incident-list');
    var ele1 = document.createElement("div");
    ele1.setAttribute("id","incident");
    ele1.setAttribute("class","incident");
    ele1.innerHTML="some more random data";
    output.appendChild(ele1);

    // NOT WORKING
    activeReports.find({}, function (err, rep) {
        if (err) {
            res.status(500).send();
        }
        else {
            let parent = document.getElementById("incident-list");

            for (let i = 0; i < rep.length; i++) {
                createIncident(parent, rep, i);
                createDropdown(parent, rep, i);
            }
        }
    });
}

function createIncident(parent, rep, i) {
    let incidentElement, idElement, timeElement, descElement, locElement;

    incidentElement = document.createElement("div");
    incidentElement.setAttribute("class", "incident");

    idElement = document.createElement("div");
    idElement.setAttribute("class", "incident-id");
    idElement.innerHTML = "ID #" + rep[i].incidentId;
    incidentElement.appendChild(idElement);

    timeElement = document.createElement("div");
    timeElement.setAttribute("class", "incident-time");
    timeElement.innerHTML = rep[i].incidentTime;
    incidentElement.appendChild(timeElement);

    incidentElement.innerHTML = "Description:";

    descElement = document.createElement("div");
    descElement.setAttribute("class", "incident-description");
    descElement.innerHTML = rep[i].incidentDescription;
    incidentElement.appendChild(descElement);

    incidentElement.innerHTML = "Location:";

    locElement = document.createElement("div");
    locElement.setAttribute("class", "incident-location");
    locElement.innerHTML = rep[i].incidentLocation;
    incidentElement.appendChild(locElement);

    parent.appendChild(incidentElement);
}

function createDropdown(parent, rep, i) {
    let dropdownElement, addinfoElement, gridElement, photoElement;

    dropdownElement = document.createElement("div");
    dropdownElement.setAttribute("class", "dropdown-info");

    addinfoElement = document.createElement("div");
    addinfoElement.setAttribute("class", "additional-info");
    addinfoElement.innerHTML = rep[i].additionalInfo;
    dropdownElement.appendChild(addinfoElement);

    for (let j; j < rep[i].photos.length; j++) {
        gridElement = document.createElement("div");
        gridElement.setAttribute("class", "photo-grid");

        photoElement = document.createElement("img");
        photoElement.setAttribute("src", rep[i].photos[j]);
        photoElement.setAttribute("alt", "photo" + j);
        gridElement.appendChild(photoElement);
    }
    dropdownElement.appendChild(gridElement);

    parent.appendChild(dropdownElement);
}