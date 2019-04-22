// This will let you use the .remove() function later on
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

mapboxgl.accessToken = 'pk.eyJ1Ijoib3VhbGEiLCJhIjoiY2p1czkxeTJsMXl6dTRkbXU5cTdpcWZnOCJ9.JFkAaaV7HSJ3E_gH1GiIBg';
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js');
// This adds the map
var map = new mapboxgl.Map({
    // container id specified in the HTML
    container: 'map',
    // style URL
    //style: 'mapbox://styles/mapbox/satellite-v9',
    style: 'mapbox://styles/mapbox/streets-v11',
    // initial position in [long, lat] format
    center: [6.5747032, 36.2514395],
    // initial zoom
    zoom: 14
});


function createEditPopUp(marker) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();


    var popup = new mapboxgl.Popup({closeOnClick: true})
        .setLngLat(marker)
        .setHTML(' <button type="button" style="width: 100%" class="btn btn-success" data-toggle="modal" data-target="#exampleModal">' +
            ' Ajouter une famille' +
            '</button>')
        .addTo(map);
}

map.on('click', function (event) {
    map.clicked = map.clicked + 1;
    var newmarker = document.getElementById('marker-new');
    // noinspection EqualityComparisonWithCoercionJS
    if (newmarker != undefined)
        newmarker.remove();
    // Create an img element for the marker
    var el = document.createElement('div');
    el.id = "marker-new";
    el.className = 'marker';
    // Add markers to the map at all points
    var marker = new mapboxgl.Marker(el, {offset: [0, -23]})
        .setLngLat(event.lngLat)
        .addTo(map);

    el.addEventListener('click', function (e) {

        e.stopPropagation();

        $('#lon').val(event.lngLat.lng);
        $('#lat').val(event.lngLat.lat);

        createEditPopUp(event.lngLat);

    });
});


var stores = {
    "type": "FeatureCollection",
    "features": []
};


// This adds the data to the map
map.on('load', function (e) {
    // This is where your '.addLayer()' used to be, instead add only the source without styling a layer
    map.addSource("places", {
        "type": "geojson",
        "data": stores
    });
    // Initialize the list
    buildLocationList();

});


function flyToStore(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 19
    });
}

function createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();

    var newmarker = document.getElementById('marker-new');
    // noinspection EqualityComparisonWithCoercionJS
    if (newmarker != undefined)
        newmarker.remove();

    var popup = new mapboxgl.Popup({closeOnClick: false})
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<h3>' + currentFeature.properties.nom + ' ' + currentFeature.properties.prenom + '</h3>' +
            '<div style="padding: 6px">' +
            '<p> adresse : ' + currentFeature.properties.address + '</p>' +
            '<p> tel : ' + currentFeature.properties.phone + '</p>' +
            '</div>'
        )
        .addTo(map);
}


function buildLocationList() {

    var commentsRef = firebase.database().ref('familles');
    var i = 0;
    commentsRef.on('child_added', function (data) {
        var currentFeature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    data.val().position.lon,
                    data.val().position.lat
                ]
            },
            "properties": {
                "nom": data.val().nom,
                "prenom": data.val().prenom,
                "phone": data.val().tel,
                "address": data.val().adresse
            }
        };

        stores.features.push(currentFeature);
        var el = document.createElement('div');
        el.id = "marker-" + i;
        el.className = 'marker';
        // Add markers to the map at all points
        new mapboxgl.Marker(el, {offset: [0, -23]})
            .setLngLat(currentFeature.geometry.coordinates)
            .addTo(map);

        el.addEventListener('click', function (e) {
            // 1. Fly to the point
            flyToStore(currentFeature);

            // 2. Close all other popups and display popup for clicked store
            createPopUp(currentFeature);

            // 3. Highlight listing in sidebar (and remove highlight for all other listings)
            var activeItem = document.getElementsByClassName('active');

            e.stopPropagation();
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }

            var listing = document.getElementById('listing-' + i);
            listing.classList.add('active');

        });
        var prop = currentFeature.properties;

        var listings = document.getElementById('listings');
        var listing = listings.appendChild(document.createElement('div'));
        listing.className = 'item';
        listing.id = "listing-" + i;

        var link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.dataPosition = i;
        link.innerHTML = prop.nom + ' ' + prop.prenom;

        var details = listing.appendChild(document.createElement('div'));
        details.innerHTML = "tel : " + prop.phone;
        details.innerHTML += "<br> adresse : " + prop.address;

        link.addEventListener('click', function (e) {
            // Update the currentFeature to the store associated with the clicked link
            var clickedListing = stores.features[this.dataPosition];
            console.log(stores.features)

            // 1. Fly to the point
            flyToStore(clickedListing);

            // 2. Close all other popups and display popup for clicked store
            createPopUp(clickedListing);

            // 3. Highlight listing in sidebar (and remove highlight for all other listings)
            var activeItem = document.getElementsByClassName('active');

            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');

        });

        i++;
    });

}


function saveHome() {
    var obj = {
        nom: $("#nom").val(),
        prenom: $("#prenom").val(),
        tel: $("#tel").val(),
        adresse: $("#adresse").val(),
        position: {
            lat: $("#lat").val(),
            lon: $("#lon").val()
        }
    };

    firebase.database().ref('familles').push().set(obj
        , function (error) {
            if (error) {
                // The write failed...
            } else {
                // Data saved successfully!
                $('#exampleModal').modal('hide');
                alert("ajouté!");
                var newmarker = document.getElementById('marker-new');
                // noinspection EqualityComparisonWithCoercionJS
                if (newmarker != undefined)
                    newmarker.remove();

                var popUps = document.getElementsByClassName('mapboxgl-popup');
                if (popUps[0]) popUps[0].remove();
            }
        });
}


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        document.getElementById("content").style.display = "block";
        document.getElementById("login_div").style.display = "none";
    } else {
        // No user is signed in.
        document.getElementById("content").style.display = "none";
        document.getElementById("login_div").style.display = "block";
    }
});

function login() {

    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Error : " + errorMessage);

        // ...
    });

}

function logout() {
    firebase.auth().signOut();
}


var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId);
}

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}
