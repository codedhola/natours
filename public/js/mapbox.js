const locations = JSON.parse(document.getElementById('map').dataset.locations)

console.log(locations)

mapboxgl.accessToken = 'pk.eyJ1IjoiY29kZWRob2xhIiwiYSI6ImNsYzZqeDB0djBuNTMzcHJ4bDdjaDlrMngifQ.D30KOqVaJsElC_u-kaKF4g';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  scrollZoom: false
  // center: [-118.5, 34], // starting position [lng, lat]
  // zoom: 9,
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds()

locations.forEach(loc => {
  // CREATE MARKER
  const el = document.createElement('div');
  el.className = 'marker';

  // ADD MARKER
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  }).setLngLat(loc.cordinates).addTo(map)

  // EXTENDS MAP
  bounds.extends(loc.cordinates)
})

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100
  }
})