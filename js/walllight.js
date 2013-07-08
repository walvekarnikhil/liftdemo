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
    camera.position.z=0;
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
    var radius = 10,
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
          // map: textureLava
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
    sphere.position.x=0;
    sphere.position.y=0;
    sphere.position.z=0;

    return sphere;
}

var scene = createScene();
var camera = createCamera();
var renderer = createRenderer();
var axis = createAxes(600);
scene.add(axis);
var sphere = createSphere();
var group = new THREE.Object3D();
group.add(sphere);
sphere.visible = false;

var building = new Building();
building.mesh().position.y-=20;
building.mesh().position.z=0;
group.add(building.mesh());
scene.add(group);
var controls = createControls(camera);

var render = function() {
    TWEEN.update();
    renderer.render(scene,camera);
    building.mesh().updateMatrix();
    // rotation_matrix = new THREE.Matrix4().makeRotationX(.01); // Animated rotation will be in .01 radians along object's X axis
    // // Update the object's rotation & apply it
    // rotation_matrix.multiply(building.mesh().matrix);
    // // building.mesh().rotation.getRotationFromMatrix(rotation_matrix);
    // building.update(renderer,scene);
}

controls.addEventListener('change',render);
var open = false;
var animate = function(){
    requestAnimationFrame(animate);
    // camera.position.x+=0.1;
    render();
    controls.update();
}

animate();

var approachLift = function(nextStep) {
    new TWEEN.Tween(building.mesh().position).to({z:60},4000).easing( TWEEN.Easing.Linear.None).start().onComplete(nextStep);
}
var moveIntoLift = function() {
    new TWEEN.Tween(building.mesh().position).to({z:120},2000).easing( TWEEN.Easing.Linear.None).start().onComplete(turnInLift);   
}
var turnInLift = function() {
    // new TWEEN.Tween(building.mesh().position).to({z:130},2000).easing( TWEEN.Easing.Linear.None).start().onComplete(turnInLift);   
    new TWEEN.Tween(group.rotation).to({y:180 * (Math.PI / 180)},4000).start().onComplete(function(){
        // new TWEEN.Tween(building.mesh().position).to({z:-125},2000);       
    });
    // new TWEEN.Tween(camera.rotation).to({y:-180 * (Math.PI / 180)},4000).start().onComplete(function(){
    //     // new TWEEN.Tween(building.mesh().position).to({z:-125},2000);       
    // });
}
var goToFloor = function(floorNo) {
    approachLift(function() {
        building.requestLiftOpen(moveIntoLift);
    });
}

$("#container").append(renderer.domElement);

$('body').keypress(function(event) {
    if (event.charCode && event.charCode == 32) {
        building.requestLiftOpen(function() {});
    } else if (event.charCode && event.charCode >= 48 && event.charCode <= 50) {
        console.log("Request to move lift to " + (event.charCode - 48));
        building.requestLiftMove(event.charCode - 48);
    } else if (event.charCode && (event.charCode == 109 || event.charCode == 77)) {
        goToFloor(1);
    } else {
        console.log(event.charCode);
    }
});

var onWindowResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}

window.addEventListener('resize',onWindowResize,false);


});