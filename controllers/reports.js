"use strict"

// Objects instantiated through the google maps API.
var map, infoWindow, service;

// Contains map marker and hospital marker objects for the map.
var mapMarkers = {},
    hospitalMarkers = {};

// Initialises the map
function initMap() {
    const styledMapType = new google.maps.StyledMapType(
        [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#1944b3"
            }]
        },
            {
                "featureType": "administrative",
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#ffffff"
                }]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{
                    "color": "#f2f2f2"
                }]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ffffff"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [{
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
                "stylers": [{
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
                "stylers": [{
                    "visibility": "simplified"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{
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
                "stylers": [{
                    "color": "#4e4e4e"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#f4f4f4"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#787878"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{
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
                "stylers": [{
                    "color": "#eaf6f8"
                }]
            }
        ], {
            name: 'Styled Map'
        });


    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -36.3833,
            lng: 145.400
        },
        zoom: 7,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map'
            ]
        }
    });

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
}

// Retrieves data of all incidents from an API call to the web server.
function getIncidents() {
    $.ajax({
        url: "/database/all",
        type: "POST",
        success: function (result) {
            clearIncidents();
            addIncidentMarkers(result);
            populateIncidents(result);
        }
    });
}

// Retrieves specific incidents based on search input (incident ID or phone number) from an API call to the web server.
function searchIncidents() {
    const id = document.getElementById('search').value;
    const data = {
        incidentId: id
    };
    $.ajax({
        url: "/database/search",
        type: "POST",
        data: data,
        success: function (result) {
            clearIncidents();
            addIncidentMarkers(result);
            populateIncidents(result);
        }
    });
}

// Clears all incidents from reports page.
function clearIncidents() {
    const reportPage = document.getElementById('report-page');
    reportPage.removeChild(document.getElementById('incident-list'));
    const incidentList = document.createElement('div');
    incidentList.setAttribute('id', 'incident-list');
    reportPage.appendChild(incidentList);

    for (let key in mapMarkers) {
        mapMarkers[key].setMap(null);
        mapMarkers[key] = null;
    }

    mapMarkers = {};
}

// Deletes a specific incident and repopulated report page with all non-deleted incidents.
function deleteIncident(id) {
    const data = {
        incidentId: id
    };
    $.ajax({
        url: "/database/delete",
        type: "POST",
        data: data,
        success: function () {
            getIncidents();
        }
    });
}

// Opens up an incident to display additional information and photos.
function activateAccordion() {
    $("#incident-list").accordion({
        active: false,
        collapsible: true,
        disabled: false
    });
}

// Builds the incident list using results from the database data
function populateIncidents(result) {
    for (let i = 0; i < result.length; i++) {
        $("#incident-list")
            .append(
                $("<div class=\"incident\" id=\"" + result[i]['incidentId'] + "\" onclick=\"incidentZoom(this)\">")
                    .append(
                        $("<div class=\"status\" id=\"status" + result[i]['incidentId'] + "\">Status: Unresolved</div></div>")
                    )
                    .append(
                        $("<div class=\"incident-id\">ID#" + result[i]['incidentId'] + "</div>")
                    )
                    .append(
                        $("<div class=\"phone-number\">Mobile: " + result[i]['phoneNumber'] + "</div>")
                    )
                    .append(
                        $("<div class=\"incident-time\">" + result[i]['time'] + "</div>")
                    )
                    .append(
                        $("<div class=\"incident-date\">" + result[i]['date'] + "</div>")
                    )
                    .append(
                        $("<div class=\"description\"><b>Description:</b></div>")
                    )
                    .append(
                        $("<div class=\"incident-description\">" + result[i]['incidentDescription'] + "</div>")
                    )
                    .append(
                        $("<div class=\"location\"><b>Location:</b></div>")
                    )
                    .append(
                        $("<div class=\"incident-location\">" + result[i]['incidentLocation'] + "</div>")
                    )
            )
            .append(
                $("<div class=\"dropdown-info\" id=\"drop"+result[i]['incidentId']+"\">")
                    .append(
                        $("<div class=\"extra-info\">")
                            .append(
                                $("<div class=\"last-updated-time\">Last updated: " + result[i]['lastUpdatedTime'] + "</div>")
                            )
                            .append(
                                $("<div class=\"additional-info-title\"><h2>Additional Info</h2></div>")
                            )
                            .append(
                                $("<div class=\"additional-info\">"+ result[i]['additionalInfo'] + "<br></div>")
                            )
                            .append(
                                $("<div class=\"photos-title\"><h2>Photos</h2></div>")
                            )
                            .append(
                                $("<div class=\"photo-grid\" id=\"photogrid"+result[i]['incidentId']+"\"></div>")
                            )
                    )
                    .append(
                        $("<div class=\"buttonContainer\">" +
                            "<button class=\"buttonAmbulance\" id=\"ambulance" + result[i]['incidentId'] + "\" " +
                            "onclick=\"sendAmbulance(" + result[i]['incidentId'] + ")\">Send ambulance</button>" +
                            "<button class=\"buttonResolved\" " +
                            "onclick=\"displayModalBox(" + result[i]['incidentId'] + ")\">Resolve incident</button>" +
                            "</div>")
                    )
            );

        // Adding photos in a photo grid.
        for (let photo = 0; photo < result[i]['photos_base64'].length; photo += 3) {
            let image = photo;
            let row_num = photo + 1;
            $("#photogrid" + result[i]['incidentId'])
                .append(
                    $("<div class=\"row\" id=\"row" + result[i]['incidentId'] + row_num + "\"></div>")
                );

            for (let col_num = 1; col_num <= 3; col_num++) {
                if (result[i]['photos_base64'][image]) {
                    $("#row" + result[i]['incidentId'] + row_num)
                        .append(
                            $("<div class=\"col\" id=\"col" + result[i]['incidentId'] + row_num + col_num + "\"></div>")
                                .append(
                                    $("<img class=\"image\" src=\"" + result[i]['photos_base64'][image] + "\" onclick=\"showPhotoModal(this)\"/>")
                                )
                                .append(
                                    $("</div>")
                                )
                        )
                } else {
                    $("#row" + result[i]['incidentId'] + row_num)
                        .append(
                            $("<div class=\"col_empty\" id=\"col" + result[i]['incidentId'] + row_num + col_num + "\"></div>")
                        )
                }
                image++;
            }
        }

        if(result[i]['ambulanceSent']) {
            markAsAmbulanceSent(result[i]['incidentId']);
        }
    }

    activateAccordion();
}

// If the ambulance has been sent, change the map pin to green, change the status of the incident,
// and change the button text
function markAsAmbulanceSent(incident) {
    const marker = mapMarkers[incident];
    marker.setIcon('/public/incident-pin-green.png');
    setTimeout(function () {
        marker.setAnimation(null);
    }, 2800);

    const status = document.getElementById("status" + incident);
    status.innerHTML = "Status: ambulance sent<br><span class=\"clickToDelete\" " +
        "onclick=\"displayModalBox(" + incident + ")\">Click here to delete</span>";
    status.style.color = "#008000";

    const button = document.getElementById("ambulance" + incident);
    button.innerHTML = "Send ambulance updated info";
    button.setAttribute("onclick", "updateInfo()");
}

// Adds markers to the map based on database data.
function addIncidentMarkers(result) {
    for (let i = 0; i < result.length; i++) {
        createIncidentMarker({
            lat: result[i]['lat'],
            lng: result[i]['lon']
        }, result[i]['incidentId']);
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

    google.maps.event.addListener(marker, 'click', function () {
        document.getElementById(this.get('id')).click();
    });

    mapMarkers[id] = marker;
}

// Finds nearby hospital markers for a specific location
function addHospitalMarkers(id) {
    return function (results, status) {
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

        google.maps.event.addListener(marker, 'click', function () {
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
            for (let i = 0; i < hospitalMarkers[key].length; i++) {
                if (hospitalMarkers[key][i]) {
                    hospitalMarkers[key][i].setMap(null);
                }
            }
        }
        else {
            const button = document.getElementById('showHideHospitals');

            if (button.innerHTML === "Hide Hospitals") {
                for (let i = 0; i < hospitalMarkers[key].length; i++) {
                    if (hospitalMarkers[key][i]) {
                        hospitalMarkers[key][i].setMap(map);
                    }
                }
            }
        }
    }
}

// Zooms in on a position on the map
function mapZoomIn(latlngPosition) {
    map.panTo(latlngPosition);
    map.setZoom(15);
}

// Centres and zooms in on an incident
function incidentZoom(element) {
    $("#" + element.id).click(function () {
        setTimeout(function () {
            const firstIncident = document.getElementById('incident-list').firstChild;
            $('#incident-list').animate({
                scrollTop: $("#" + element.id).position().top - $("#" + firstIncident.id).position().top
            }, 300, "linear");
        }, 350);
    });

    // Scroll to the incident on the left sidebar
    element.scrollIntoView({
        behavior: 'smooth'
    });
    mapZoomIn(mapMarkers[element.id].getPosition());
    mapMarkers[element.id].setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
        mapMarkers[element.id].setAnimation(null);
    }, 2800);
}


// Handles when the 'Send Ambulance' button is clicked. Changes the incident marker to green, bounces the marker,
// changes incident text, and triggers a pop up alert.
function sendAmbulance(incidentId) {
    const ambulanceSentModal = document.getElementById('ambulanceSentModal');

    markAsAmbulanceSent(incidentId);

    const data = {
        incidentId: incidentId
    };
    $.ajax({
        url: "/database/sendAmbulance",
        type: "POST",
        data: data
    });

    ambulanceSentModal.style.display = "block";

    $(".okay").on("click", function () {
        ambulanceSentModal.style.display = "none";
    })
}

// Update information on a specific incident.
function updateInfo() {
    const updatedInfoModal = document.getElementById('updatedInfoModal');

    updatedInfoModal.style.display = "block";

    $(".okay").on("click", function () {
        updatedInfoModal.style.display = "none";
    })
}

// Displays the modal box that confirms whether to delete an incident
function displayModalBox(incidentId) {
    document.getElementById('idToDelete').innerHTML = incidentId;

    deleteIncidentModal.style.display = "block";

    $("#buttonYes").on('click', function () {
        deleteIncident(incidentId);
        hideModalBox();
    });

    $("#buttonNo").on('click', function () {
        hideModalBox();
    });
}

// Hides the delete incident modal box
function hideModalBox() {
    deleteIncidentModal.style.display = "none";
}

// Toggle hospital locations off
function showHideHospitals() {
    let buttonText = document.getElementById('showHideHospitals').innerHTML;

    if (buttonText === "Show Hospitals") {
        document.getElementById('showHideHospitals').innerHTML = "Hide Hospitals";

        let marker;

        for (let key in hospitalMarkers) {
            if (typeof mapMarkers[key] !== "undefined") {
                for (let hospital in hospitalMarkers[key]) {
                    marker = hospitalMarkers[key][hospital];

                    if (marker) {
                        hospitalMarkers[key][hospital].setMap(map);
                    }
                }
            }
        }
    } else {
        document.getElementById('showHideHospitals').innerHTML = "Show Hospitals";

        let marker;

        for (let key in hospitalMarkers) {
            for (let hospital in hospitalMarkers[key]) {
                marker = hospitalMarkers[key][hospital];

                if (marker) {
                    hospitalMarkers[key][hospital].setMap(null);
                }
            }
        }
    }
}

// Refresh the incidents
function updateReports() {
    searchIncidents();
}

// Zoom out to the original view
function resetView() {
    map.panTo({
        lat: -36.3833,
        lng: 145.400
    });
    map.setZoom(7);
}

// Open a photo in a modal
function showPhotoModal(photo) {
    document.getElementById('photo-modal').style.display = "block";
    document.getElementById("photo-modal-image").src = photo.src;
}

// Closes the photo modal
function closePhotoModal() {
    document.getElementById('photo-modal').style.display = "none";
}