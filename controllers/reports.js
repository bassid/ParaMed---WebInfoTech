var map, infoWindow;
var mapMarkers = {};

// Retrieves data of incidents from an API call to the database.
function getIncidents(data) {
    $.ajax({
        url: "http://localhost:3000/database", type: "POST", data: data, success: function (result) {
            populateIncidents(result);
            addMapMarkers(result);
        }
    });
}

// Adds markers to the map based on database data.
function addMapMarkers(result){
    for(var i=0; i<result.length; i++){
        addMarker({lat: result[i]['lat'], lng: result[i]['lon']}, result[i]['id']);
    }
}

// Builds the incident list using results from the database data
function populateIncidents(result){
    for(var i=0; i<result.length; i++) {
        $("#incident-list")
            .append(
                $("<div class=\"incident\" id=\""+result[i]['id']+"\" onclick=\"incidentZoom(this)\">")
                    .append(
                        $("<div class=\"incident-id\">ID#" + result[i]['id'] + "</div>")
                    )
                    .append(
                        $("<div class=\"incident-time\">" + result[i]['time'] + "</div>")
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
                    .append(
                        $("</div>")
                    )
            )
            .append(
                $("<div class=\"dropdown-info\">")
                    .append(
                        $("<div class=\"incident\">")
                            .append(
                                $("<div class=\"incident-id\"><h2>ID#" + result[i]['id'] + "</h2></div>")
                            )
                            .append(
                                $("<div class=\"incident-time\">" + result[i]['time'] + "</div><br>")
                            )
                            .append(
                                $("<div class=\"incident-description\">" + result[i]['incidentDescription'] + "</div>")
                            )
                            .append(
                                $("<div class=\"incident-location\">" + result[i]['incidentLocation'] + "</div>")
                            )
                            .append(
                                $("</div>")
                            )
                    )
                    .append(
                        $("<div class=\"additional-info\">")
                            .append(
                                $("<h2>Additional Info</h2>" + result[i]['additionalInfo'] + "<br>")
                            )
                            .append(
                                $("</div>")
                            )
                    )
                    .append(
                        $("<div class=\"photos-title\"><h2>Photos</h2></div>")
                    )
                    .append(
                        $("<div class=\"photo-grid\" id=\"photogrid"+result[i]['id']+"\"></div>")
                    )
                    .append(
                        $("</div>")
                    )
            );

        for(var j=0; j<result[i]['photos'].length; j++){
            $("#photogrid"+result[i]['id'])
                .append(
                    $("<div class=\"photo\">")
                        .append(
                            $("<img src=\""+result[i]['photos'][j]+"\" alt=\"ParaMed logo\"/>")
                        )
                        .append(
                            $("</div>")
                        )
                )
        }
    }
    $( "#incident-list" ).accordion({
        active: false,
        collapsible: true
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.793, lng: 144.969},
        zoom: 10
    });
}

function addMarker(location, id) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: '/public/incident-icon.png',
        id: id
    });

    google.maps.event.addListener(marker, 'click', function(){
        document.getElementById(this.get('id')).click();
    });

    mapMarkers[id] = marker;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function mapZoomIn(latlngPosition){
    map.panTo(latlngPosition);
    map.setZoom(13);
}

function incidentZoom(element){
    element.scrollIntoView({behavior: 'smooth'});
    mapZoomIn(mapMarkers[element.id].getPosition());
    mapMarkers[element.id].setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ mapMarkers[element.id].setAnimation(null); }, 2800);

}