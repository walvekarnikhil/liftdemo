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
    camera.position.y=100;
    camera.position.z=400;
    camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
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
    light.lookAt(new THREE.Vector3( 0,0, 0 ));
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


var FLOOR_HEIGHT = 100;
var floor1 = new Floor(0,FLOOR_HEIGHT);
scene.add(floor1.mesh());
// var floor2 = new Floor(1,FLOOR_HEIGHT);
// scene.add(floor2.mesh());

var liftHeight = FLOOR_HEIGHT - (FLOOR_HEIGHT/4);
var lift = new Lift(40,liftHeight,40,true,scene);
lift.mesh().position.set(0,FLOOR_HEIGHT/2-((FLOOR_HEIGHT/2)-(liftHeight/2)),-120);
scene.add(lift.mesh());


var controls = createControls(camera);

var render = function() {
    renderer.render(scene,camera);
}

controls.addEventListener('change',render);
var open = false;
var animate = function(){
    requestAnimationFrame(animate);
    render();
    if (open) {
        lift.open();
    } else {
        lift.close();
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