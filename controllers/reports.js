"use strict"

var map, infoWindow, service;
var mapMarkers = {}, hospitalMarkers = {};

// Initialises the map
function initMap() {
    const styledMapType = new google.maps.StyledMapType(
        [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#1944b3"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#e6f3d6"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#f3c580"
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "color": "#4e4e4e"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#f4f4f4"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#787878"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#eaf6f8"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#eaf6f8"
                    }
                ]
            }
        ],
        {name: 'Styled Map'});


    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -36.3833, lng: 145.400},
        zoom: 7,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map']
        }
    });

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
}

// Retrieves data of incidents from an API call to the database.
function getIncidents() {
    $.ajax({
        url: "/database/all", type: "POST", success: function (result) {
            clearIncidents();
            populateIncidents(result);
            addIncidentMarkers(result);
        }
    });
}

// Retrieves specific incidents based on search input
function searchIncidents() {
    const id = document.getElementById('search').value;
    const data = {incidentId: id};
    $.ajax({
        url: "/database/search", type: "POST", data: data, success: function (result) {
            clearIncidents();
            populateIncidents(result);
            addIncidentMarkers(result);
        }
    });
}

// Clears all incidents from report page
function clearIncidents(){
    const reportPage = document.getElementById('report-page');
    reportPage.removeChild(document.getElementById('incident-list'));
    const incidentList = document.createElement('div');
    incidentList.setAttribute('id', 'incident-list');
    reportPage.appendChild(incidentList);

    for(let key in mapMarkers) {
        mapMarkers[key].setMap(null);
        mapMarkers[key] = null;
    }

    mapMarkers = {};
}

// Deletes a specific incident and repopulated report page with all non-deleted incidents
function deleteIncident(id) {
    const data = {incidentId: id};
    $.ajax({
        url: "/database/delete", type: "POST", data: data, success: function () {
            getIncidents();
        }
    });
}

function activateAccordion() {
    $("#incident-list").accordion({
        active: false,
        collapsible: true,
        disabled: false
    });
}

function disableAccordion() {
    $("#incident-list").accordion({
        active: false,
        collapsible: true,
        disabled: true
    });
}

// Builds the incident list using results from the database data
function populateIncidents(result){
    for(let i=0; i<result.length; i++) {
        $("#incident-list")
            .append(
                $("<div class=\"incident\" id=\""+result[i]['incidentId']+"\" onclick=\"incidentZoom(this)\">")
                    .append(
                        $("<span class=\"closeButton\" onclick=\"displayModalBox(" + result[i]['incidentId'] + ")\">&times;</span>")
                    )
                    .append(
                        $("<div class=\"incident-id\">ID#" + result[i]['incidentId'] + "</div>")
                    )
                    .append(
                        $("<div class=\"phone-number\">(" + result[i]['phoneNumber'] + ")</div>")
                    )
                    .append(
                        $("<div class=\"incident-time\">" + result[i]['time'] + "</div>")
                    )
                    .append(
                        $("<div class=\"incident-date\">" + result[i]['date'] + "</div>")
                    )
                    .append(
                        $("<div class=\"description\">Description:</div>")
                    )
                    .append(
                        $("<div class=\"incident-description\">" + result[i]['incidentDescription'] + "</div>")
                    )
                    .append(
                        $("<div class=\"location\">Location:</div>")
                    )
                    .append(
                        $("<div class=\"incident-location\">" + result[i]['incidentLocation'] + "</div>")
                    )

            )
            .append(
                $("<div class=\"dropdown-info\">")
                    .append(
                        $("<div class=\"last-updated-time\">Last updated: " + result[i]['lastUpdatedTime'] + "</div>")
                    )
                    .append(
                        $("<div class=\"additional-info\">")
                            .append(
                                $("<h2>Additional Info</h2>" + result[i]['additionalInfo'] + "<br>")
                            )
                    )
                    .append(
                        $("<div class=\"photos-title\"><h2>Photos</h2></div>")
                    )
                    .append(
                        $("<div class=\"photo-grid\" id=\"photogrid"+result[i]['incidentId']+"\"></div>")
                    )
            );

        for(let j=0; j<result[i]['photos'].length; j++){
            $("#photogrid"+result[i]['incidentId'])
                .append(
                    $("<div class=\"photo\">")
                        .append(
                            $("<img src=\""+result[i]['photos'][j]+"\" onclick=\"showPhotoModal(this)\"/>")
                        )
                        .append(
                            $("</div>")
                        )
                )
        }
        for(let j=0; j<result[i]['photos_base64'].length; j++){
            $("#photogrid"+result[i]['incidentId'])
                .append(
                    $("<div class=\"photo\">")
                        .append(
                            $("<img src=\""+result[i]['photos_base64'][j]+"\" onclick=\"showPhotoModal(this)\"/>")
                        )
                        .append(
                            $("</div>")
                        )
                )
        }
    }

    activateAccordion();
}

// Adds markers to the map based on database data.
function addIncidentMarkers(result){
    for(let i=0; i<result.length; i++){
        createIncidentMarker({lat: result[i]['lat'], lng: result[i]['lon']}, result[i]['incidentId']);
    }

    removeHospitalMarkers();
}

// Adds a marker to the map for a specific incident and adds nearby hospital markers
function createIncidentMarker(location, id) {
    // Add markers for hospitals within a 20km radius of this location if the id doesn't exist in hospitalMarkers already
    if (!hospitalMarkers[id]) {
        service.nearbySearch({
            location: location,
            radius: 20000,
            type: ['hospital']
        }, addHospitalMarkers(id));
    }

    let marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: '/public/incident-pin.png',
        id: id
    });

    google.maps.event.addListener(marker, 'click', function(){
        document.getElementById(this.get('id')).click();
    });

    mapMarkers[id] = marker;
}

// Finds nearby hospital markers for a specific location
function addHospitalMarkers(id) {
    return function(results, status) {
        let markers = [];
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
                markers.push(createHospitalMarker(results[i], id));
                if (markers[i]) {
                    markers[i].setMap(null);
                }
            }
        }
        hospitalMarkers[id] = markers;
    }
}

// Adds hospital marker to the map
function createHospitalMarker(place, id) {
    if (place.name.includes("Hospital")) {
        let placeLoc = place.geometry.location;
        let marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: '/public/hospital-pin.png'
        });

        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent('<strong>' + place.name + '</strong');
            infoWindow.open(map, this);
        });

        return marker;
    }
    return null;
}

// Removes any hospital markers that don't correspond to an incident
function removeHospitalMarkers() {
    for (let key in hospitalMarkers) {
        // If the incident corresponding to those hospitals doesn't exist, remove those hospitals
        if (typeof mapMarkers[key] === "undefined") {
            for (let hospital in hospitalMarkers[key]) {
                hospitalMarkers[key][hospital].setMap(null);
            }
            hospitalMarkers[key] = null;
        }
    }
}

// Zooms in on a position on the map
function mapZoomIn(latlngPosition){
    map.panTo(latlngPosition);
    map.setZoom(15);
}

// Centres and zooms in on an incident
function incidentZoom(element){
    element.scrollIntoView({behavior: 'smooth'});
    mapZoomIn(mapMarkers[element.id].getPosition());
    mapMarkers[element.id].setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ mapMarkers[element.id].setAnimation(null); }, 2800);
}

// Displays the modal box that confirms whether to delete an incident
function displayModalBox(incidentId) {
    // Disable dropdown box being displayed when delete button pressed
    disableAccordion();

    document.getElementById('idToDelete').innerHTML = incidentId;

    deleteIncidentBox.style.display = "block";

    $("#buttonYes").on('click', function() {
        deleteIncident(incidentId);
        hideModalBox();
        activateAccordion();
    });

    $("#buttonNo").on('click', function() {
        hideModalBox();
        activateAccordion();
    });
}

// Hides the modal box
function hideModalBox() {
    deleteIncidentBox.style.display = "none";
}

function showHideHospitals() {
    let buttonText = document.getElementById('showHideHospitals').innerHTML;

    if (buttonText === "Show hospitals") {
        document.getElementById('showHideHospitals').innerHTML = "Hide hospitals";

        let marker;

        for(let key in hospitalMarkers){
            for (let hospital in hospitalMarkers[key]) {
                marker = hospitalMarkers[key][hospital];

                if(marker) {
                    hospitalMarkers[key][hospital].setMap(map);
                }
            }
        }
    }
    else {
        document.getElementById('showHideHospitals').innerHTML = "Show hospitals";

        let marker;

        for(let key in hospitalMarkers){
            for (let hospital in hospitalMarkers[key]) {
                marker = hospitalMarkers[key][hospital];

                if(marker) {
                    hospitalMarkers[key][hospital].setMap(null);
                }
            }
        }
    }
}

function updateReports() {
    getIncidents();
}

function zoomOut() {
    map.panTo({lat: -36.3833, lng: 145.400});
    map.setZoom(7);
}

function showPhotoModal(photo){
    document.getElementById('photo-modal').style.display = "block";
    document.getElementById("photo-modal-image").src = photo.src;
}

function closePhotoModal(){
    document.getElementById('photo-modal').style.display = "none";
}