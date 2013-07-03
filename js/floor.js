/**
 * Created with JetBrains WebStorm.
 * User: rohitghatol
 * Date: 7/2/13
 * Time: 8:50 PM
 * To change this template use File | Settings | File Templates.
 */

var Slab = function(x,y,materialcolor,reflectivity,textureUrl) {
    var floorPlanGeometry = new THREE.PlaneGeometry(x,y);

    // var elevatorSpaceGeometry = new THREE.CubeGeometry(100,5,50);

    // var floorCutoutGeometry = (new ThreeBSP(floorPlanGeometry)).subtract(new ThreeBSP(elevatorSpaceGeometry)).toGeometry();

    var texture = undefined;
    if (textureUrl) {
	    texture = THREE.ImageUtils.loadTexture( textureUrl );
	    // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	    texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
	    texture.format = THREE.RGBFormat;
	    // texture.anisotropy = 16;
	    // texture.repeat.set( 512,512);
	}

    var material =
        new THREE.MeshPhongMaterial({
            map: texture,
        	reflectivity:reflectivity,
            // light
            specular: 0xFFFFFF,
            // intermediate
            // color: 0xFFFFE3,
            // ambient: 0xFFFFE3,
            // dark
            emissive: materialcolor,
            shininess: 100
        });

    var object = new THREE.Mesh(floorPlanGeometry,material);
    object.rotation.x = - Math.PI / 2;
    return object;
}

var Floor = function(elevation){

	var FLOOR_HEIGHT = 100;
	var group = new THREE.Object3D();

	var floorSlab = new Slab(200,200,0x777777,true,"http://localhost/~nikhilw/3d/img/floor.jpg");
	var ceilSlab = new Slab(200,200,0x888888,false,"http://localhost/~nikhilw/3d/img/ceil.jpg");
	ceilSlab.position.y = FLOOR_HEIGHT ;
	ceilSlab.rotation.x=Math.PI / 2;
	group.add(floorSlab);
	group.add(ceilSlab);


	var wall1 = new Wall(70,100, new THREE.Vector3(-65,50,-98),"http://localhost/~nikhilw/3d/img/brick1.jpg",0x404040);
	var wall2 = new Wall(70,100, new THREE.Vector3(65,50,-98),"http://localhost/~nikhilw/3d/img/brick1.jpg",0x404040);
	var wallL = new Wall(200,100, new THREE.Vector3(-98,50,0),"http://localhost/~nikhilw/3d/img/sidewall.jpg",0x888888);
	wallL.rotation.y=90 * (Math.PI / 180);
	var wallR = new Wall(200,100, new THREE.Vector3(98,50,0),"http://localhost/~nikhilw/3d/img/sidewall.jpg",0x888888);
	wallR.rotation.y=90 * (Math.PI / 180);
	

	var light1Position = new THREE.Vector3(-65,100,-90);
	var light1Target = new THREE.Vector3(-65,10,-98);
	var light2Position = new THREE.Vector3(65,100,-90);
	var light2Target = new THREE.Vector3(65,10,-98);

	var spotLight1 = createSpotLight(0xffffff,8,light1Position,light1Target,90);
	var spotLight2 = createSpotLight(0xffffff,8,light2Position,light2Target,90);

	group.add(wall1);
	group.add(wall2);
	group.add(wallL);
	group.add(wallR);
	group.add(spotLight1);
	group.add(spotLight2);

	group.add(createAmbientLight(0x4b4b4b));

	var lift = new Lift(60,FLOOR_HEIGHT,60);
	lift.position.set(0,FLOOR_HEIGHT/2,-130);
	group.add(lift);
    var self = this;
    self.mesh = group;
    self.mesh.position.y=elevation;

    return self;

}

var Cube = function(
    width,height,depth,textureUrl,materialcolor){
    var cubeGeometry = new THREE.CubeGeometry(
        width,height,depth);
    // var material = 
    //     new THREE.MeshLambertMaterial(
    //         {
    //             color:0xFF0000
    //         });
    
    // var cubeMesh = new THREE.Mesh(
    //     cubeGeometry,material);

    var textureLava = THREE.ImageUtils.loadTexture( textureUrl );
    textureLava.wrapS = textureLava.wrapT = THREE.RepeatWrapping;
    textureLava.format = THREE.RGBFormat;

    var materialPhong = new THREE.MeshPhongMaterial( { shininess: 50, ambient: 0xFFFFFF, color: 0xffffff, specular: 0x999999, map: textureLava,emissive: materialcolor } );
    // var torusGeometry = new THREE.TorusGeometry( 240, 60, 32, 64 );
    // addObject( torusGeometry, materialPhong, 0, 100, 0, 0 );
    // textureLava.repeat.set( 6, 2 );
    
    var cubeMesh = new THREE.Mesh(
        cubeGeometry,materialPhong);
    
    return cubeMesh;
  
};

var Wall = function (width, height,position, textureUrl,materialcolor) {
    var cube = new Cube(width,height,4,textureUrl,materialcolor);
    cube.position = position;
    return cube;
}