
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZjVhNTE1NS04MTFiLTQwMTgtYWJjMy1iNjY0NDI0Mzk5MzgiLCJpZCI6MTA0MjA3LCJpYXQiOjE2NjAwNDk0NTZ9.gWfuJ2NgZcnTgM0_G-XMccqU-iWIUejCQyCQxwH0_Wo";


// Create cesium viewer
const viewer = new Cesium.Viewer('cesiumContainer', {
  scene3DOnly: false,
  selectionIndicator: false,
  baseLayerPicker: true,
  shouldAnimate: true,
});

// Enable lighting based on sun/moon position
viewer.scene.globe.enableLighting = true;


// Given location (lat,long)
let my_position = [
  77.2217831, // Latitude
  28.6862738, // Longitude
]


// Draw given location on the model
var GroundStation = viewer.entities.add({
  name: "Given Location",
  position: Cesium.Cartesian3.fromDegrees(my_position[0],my_position[1]),
  point: {
    pixelSize: 5,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2,
  },
  label: {
    text: "Ground Station",
    font: "14pt monospace",
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    outlineWidth: 2,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    pixelOffset: new Cesium.Cartesian2(0,-9)
  }
})

// Camera point to given location
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(my_position[0],my_position[1], 1000*10000)
})

// Satellite CZML file loaded
Cesium.CzmlDataSource.load("./CARTOSAT-3.czml").then( (data) => {
  viewer.dataSources.add(data).then((data1) => {  
  })
})

// Execute below code after necessary files are loaded in browser
setTimeout(() => {
  var clock = viewer.clock
  var ec = viewer.dataSources._dataSources[0]._entityCollection;
  var sat = ec.getById(44804)
  console.log(sat)
  var cartesian = sat.position.getValue(clock.currentTime);
  var cartographic = Cesium.Cartographic.fromCartesian(cartesian);

  var longitude = Cesium.Math.toDegrees(cartographic.longitude)
  var latitude = Cesium.Math.toDegrees(cartographic.latitude)
  var height = cartographic.height


  // Updates cone to be drawn with satellite positions
  setInterval(function() {
    viewer.entities.removeById("redcone"); // to delte previous cone after it is updated with new location
   // var satLocation = new Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
   // var groundPoint = new Cesium.Cartesian3.fromDegrees(longitude, latitude, 0.0);
   
    var instrumentFOV = 760 * 1000; // swath-width
     
    // Coordinates of satellite at given or current time
    cartesian = sat.position.getValue(clock.currentTime);
    cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    longitude = Cesium.Math.toDegrees(cartographic.longitude);
    latitude = Cesium.Math.toDegrees(cartographic.latitude);
    height = cartographic.height;

    // draws footprint of satellite based on its swath width of its instrument along the ground
    var redCone = viewer.entities.add({
      id: "redcone",
        name : 'Red cone',
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height/2),
        cylinder : {
            length : height,
            topRadius : 0.0,
            bottomRadius : instrumentFOV / 2,
            material : Cesium.Color.YELLOWGREEN,
            outline: true,
            outlineColor: Cesium.Color.RED.withAlpha(0.5)
        }
    });

  }, 1*1000);	// Updates every 1 seconds
    
},30*1000) // Starts after 30 seconds of running on browser

