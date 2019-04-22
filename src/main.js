// This will let you use the .remove() function later on
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js');
// This adds the map
var map = new mapboxgl.Map({
    // container id specified in the HTML
    container: 'map',
    // style URL
    style: 'mapbox://styles/mapbox/satellite-v9',
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
        console.log(marker);

        e.stopPropagation();

        createEditPopUp(event.lngLat);

    });
});


var stores = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    6.5747032,
                    36.2514395
                ]
            },
            "properties": {
                "id": 1,
                "nom": "Benchibota",
                "prenom": "Aboubaker",
                "phone": "07 70 66 77 98",
                "address": "Cité alhayat n° 149, Didouche Morad"
            }

        }]
};
// This adds the data to the map
map.on('load', function (e) {
    // This is where your '.addLayer()' used to be, instead add only the source without styling a layer
    map.addSource("places", {
        "type": "geojson",
        "data": stores
    });
    // Initialize the list
    buildLocationList(stores);

});

// This is where your interactions with the symbol layer used to be
// Now you have interactions with DOM markers instead
stores.features.forEach(function (marker, i) {
    // Create an img element for the marker
    var el = document.createElement('div');
    el.id = "marker-" + i;
    el.className = 'marker';
    // Add markers to the map at all points
    new mapboxgl.Marker(el, {offset: [0, -23]})
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

    el.addEventListener('click', function (e) {
        // 1. Fly to the point
        flyToStore(marker);

        // 2. Close all other popups and display popup for clicked store
        createPopUp(marker);

        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        var activeItem = document.getElementsByClassName('active');

        e.stopPropagation();
        if (activeItem[0]) {
            activeItem[0].classList.remove('active');
        }

        var listing = document.getElementById('listing-' + i);
        listing.classList.add('active');

    });
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


    var popup = new mapboxgl.Popup({closeOnClick: false})
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<h3>' + currentFeature.properties.nom + ' ' + currentFeature.properties.prenom + '</h3>' +
            '<h4> adresse : ' + currentFeature.properties.address + '</h4>' +
            '<h4> tel : ' + currentFeature.properties.phone + '</h4>'
        )
        .addTo(map);
}


function buildLocationList(data) {
    for (i = 0; i < data.features.length; i++) {
        var currentFeature = data.features[i];
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
            var clickedListing = data.features[this.dataPosition];

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
    }
}

