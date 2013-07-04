$(document).ready(function(){
var aspect = window.innerWidth / window.innerHeight;
var near = 0.1;
var far = 8000;
var angle = 45;

var createRenderer = function(){
    var renderer =  new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    return renderer;
}

var createCamera = function(){
    var camera = new THREE.PerspectiveCamera(
        angle, aspect, near, far);
    camera.position.x=0;
    camera.position.y=0;
    camera.position.z=50;
    return camera;
}

var createScene = function(){
    var scene = new THREE.Scene();
    return scene;
}
var createLight = function(){
    var light = new THREE.PointLight(0xFFFFFF);
    light.position.x=150;
    light.position.y=150;
    light.position.z=300;
    return light;
}



var createSphere = function ()  {
    // set up the sphere vars
    var radius = 50,
        segments = 16,
        rings = 16;

    var textureLava = THREE.ImageUtils.loadTexture( "img/lavatile.jpg" );

    // create the sphere's material
    var sphereMaterial =
      new THREE.MeshPhongMaterial(
        {
          color: 0xCC0000,
          shininess: 50,
          reflectivity:3,
          map: textureLava
        });
    // create a new mesh with
    // sphere geometry - we will cover
    // the sphereMaterial next!
    var sphere = new THREE.Mesh(

      new THREE.SphereGeometry(
        radius,
        segments,
        rings),

      sphereMaterial);

    return sphere;
}

var scene = createScene();
var camera = createCamera();
var renderer = createRenderer();
var axis = createAxes(600);
// scene.add(axis);


// var FLOOR_HEIGHT = 100;

// var liftHeight = FLOOR_HEIGHT - (FLOOR_HEIGHT/4);
// var lift = new Lift(40,liftHeight,40,true,scene);
// lift.mesh().position.set(0,FLOOR_HEIGHT/4-((FLOOR_HEIGHT/2)-(liftHeight/2)),-120);
// var liftCutOut = new THREE.Mesh(new THREE.CubeGeometry(
//         40,liftHeight,10));
// liftCutOut.position.set(0,-1 * (FLOOR_HEIGHT- liftHeight)/2,0);
// scene.add(lift.mesh());
// camera.lookAt(lift.mesh().position);

// var floor1 = new Floor(0,FLOOR_HEIGHT,liftCutOut);
// floor1.mesh().position.y=-FLOOR_HEIGHT/4;
// scene.add(floor1.mesh());
// // var floor2 = new Floor(1,FLOOR_HEIGHT);
// // scene.add(floor2.mesh());


// var createLobby = function() {
//     var floorPlanGeometry = new THREE.PlaneGeometry(690,337);

//     // var elevatorSpaceGeometry = new THREE.CubeGeometry(100,5,50);

//     // var floorCutoutGeometry = (new ThreeBSP(floorPlanGeometry)).subtract(new ThreeBSP(elevatorSpaceGeometry)).toGeometry();

//     var texture = THREE.ImageUtils.loadTexture( "img/lobby.jpg" );
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//     texture.format = THREE.RGBFormat;
//     var material =
//         new THREE.MeshPhongMaterial({
//             map: texture,
//             side:THREE.DoubleSide,
//             emissive: 0xFFFFFF,
//         });
//     var object = new THREE.Mesh(floorPlanGeometry,material);
//     object.position.set(0,50,100);
//     return object;
// }

// var lobby = createLobby();
// scene.add(lobby);
var building = new Building();
building.mesh().position.y-=20;
scene.add(building.mesh());
var controls = createControls(camera);

var render = function() {
    renderer.render(scene,camera);
    building.updateMirror(renderer,scene);
}

controls.addEventListener('change',render);
var open = false;
var animate = function(){
    requestAnimationFrame(animate);
    // camera.position.x+=0.1;
    render();
    if (open) {
        building.liftOpen();
    } else {
        building.liftClose();
    }

    controls.update();
}

animate();

$("#container").append(renderer.domElement);

$('body').keypress(function(event) {
    if (event.charCode && event.charCode == 32) {
        open = !open;
    }
});

var onWindowResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}

window.addEventListener('resize',onWindowResize,false);


});