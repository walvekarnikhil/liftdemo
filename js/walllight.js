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

    var textureLava = THREE.ImageUtils.loadTexture( "http://localhost/~nikhilw/3d/img/lavatile.jpg" );

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
var sphere = createSphere();
// var cube = createCube(30,30,30,'blue');
// var wall = new Wall(200,40,"http://localhost/~nikhilw/3d/img/lavatile.jpg");
var floor = new Floor(0);
// cube.position.set(0,0,80);
// scene.add(light);
var axis = createAxes(600);
scene.add(floor.mesh);
scene.add(axis);
// scene.add(sphere);
// scene.add(wall);
// scene.add( spotLight );

var controls = createControls(camera);

var render = function() {
    renderer.render(scene,camera);
}

controls.addEventListener('change',render);
var animate = function(){
    requestAnimationFrame(animate);
    render();
    controls.update();
}

animate();

$("#container").append(renderer.domElement);

var onWindowResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}

window.addEventListener('resize',onWindowResize,false);


});