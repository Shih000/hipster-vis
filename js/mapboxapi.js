//mapbox token
mapboxgl.accessToken='pk.eyJ1Ijoic2hpaDAwMCIsImEiOiJjamtubGNpd3kwOGhtM3ZwMmRjMXgzd2NuIn0.wNTCjYererFafy4yChuKdw'; 

//starting position -->NYC
var position = new mapboxgl.LngLat(-73.9840, 40.7549).wrap();

//map instance
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/shih000/cjlg7flfn4fiz2sl8101fx5rj',
    center: [position.lng, position.lat], 
    // zoom: 12 //starting zoom
    minZoom: 12,
    maxZoom: 15
});

// adding starbucks/hipsters data source and mapping
map.on('load', function() {
    map.addLayer({
	'id': 'starbucks',
  	'type': 'circle',
    'source': {
        'type': 'geojson',
        'data': './data/sb-locations.geojson'
        },
    'paint': {
        'circle-radius': [
            "interpolate", ["linear"], ["zoom"],
            12, 5.5, 15, 8.5,
        ],
        'circle-color': '#00704a',
        'circle-opacity': 0.6
        }
    }); 
  
    map.addLayer({
    'id': 'hipster',
    'type': 'circle',
    'source': {
        'type': 'geojson',
        'data': './data/all_hipster.geojson'
        },
    'paint': {
        'circle-radius': [
            "interpolate", ["linear"], ["zoom"],
            12, 5.5, 15, 8.5,
        ],
        'circle-color': '#6AADFA',
        'circle-opacity': 0.7
        }
    });
});

  //This is for the heatmap.
map.on('load', function() {
    // Add a geojson point source.
    // Heatmap layers also work with a vector tile source.
    map.addLayer({
        "id": "Heatmap2",
        "type": "heatmap",
        "source": {
            "type": "geojson",
            "data": "data/sb-locations.geojson"
        },
        "paint": {
            "heatmap-intensity": [
                "interpolate", ["linear"], ["zoom"],
                0, 1, 9, 3
            ],
            "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(237,248,251,0)",
                0.2, "rgb(204,236,230)",
                0.4, "rgb(153,216,201)",
                0.6, "rgb(102,194,164)",
                0.8, "rgb(44,162,95)",
                1, "rgb(0,109,44)"
            ],
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": [
                "interpolate", ["linear"],["zoom"],
                12, 25, 15, 6
            ],
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 0.7, 14.5, 0
            ],
        }
    });
    map.addLayer({
        "id": "Heatmap",
        "type": "heatmap",
        "source": {
            "type": "geojson",
            "data": "data/all_hipster.geojson"
        },
        "paint": {
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            "heatmap-intensity": [
                "interpolate", ["linear"], ["zoom"],
                0, 1, 9, 3
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(239,243,255,0)",
                0.2, "rgb(198,219,239)",
                0.4, "rgb(158,202,225)",
                0.6, "rgb(107,174,214)",
                0.8, "rgb(49,130,189)",
                1, "rgb(8,81,156)"
            ],
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": [
                "interpolate", ["linear"],["zoom"],
                12, 25, 15, 6
            ],
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 0.7, 14.5, 0
            ],
        }
    });
});

//add heatmap button
var toggleableLayerIds = ['Heatmap','Heatmap2'];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('heatmap-button');
    layers.appendChild(link);
}

// When a click event occurs near a place, open a popup at the location of
// the feature, with HTML description from its properties
map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['hipster'] });
  
    // if the features have no info, return nothing
    if (!features.length) {
      return;
    }
  
    var feature = features[0];
  
    // Populate the popup and set its coordinates
    // based on the feature found
    var popup = new mapboxgl.Popup()
    .setLngLat(feature.geometry.coordinates)
    .setHTML(feature.properties.name)
    .addTo(map);
  });

  // Use the same approach as above to indicate that the symbols are clickable
  // by changing the cursor style to 'pointer'
  map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['hipster'] });
    map.getCanvas().style.cursor = features.length ? 'pointer' : '';
  });

document.getElementById('nyc-button').addEventListener('click', function() {
    map.fitBounds([[
        -74.125677,
        40.671375
    ], [
        -73.860579,
        40.812207
    ]]);
});

document.getElementById('sfc-button').addEventListener('click', function() {
    map.fitBounds([[
        -122.506629,
        37.735608
    ], [
        -122.401326,
        37.806728
    ]]);
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());