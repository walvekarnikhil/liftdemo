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
	    
	}

    var material =
        new THREE.MeshPhongMaterial({
            map: texture,
            side:THREE.DoubleSide,
        	// reflectivity:reflectivity,
         //    // light
         //    specular: 0xFFFFFF,
         //    // intermediate
         //    // color: 0xFFFFE3,
         //    // ambient: 0xFFFFE3,
         //    // dark
            emissive: materialcolor,
         //    shininess: 100
        });
    var object = new THREE.Mesh(floorPlanGeometry,material);
    
    object.rotation.x = - Math.PI / 2;
    if (textureUrl) 
        texture.repeat.set( 10,10);
    return object;
}

var Floor = function(elevation,FLOOR_HEIGHT){
	var group = new THREE.Object3D();

	var floorSlab = new Slab(200,200,0x444444,true,"img/floor.gif");
	var ceilSlab = new Slab(200,200,0x888888,false,"img/ceil.jpg");
	ceilSlab.position.y = FLOOR_HEIGHT-0.1 ;
	ceilSlab.rotation.x=Math.PI / 2;
	group.add(floorSlab);
	group.add(ceilSlab);
    var liftWallWidth = 200;
    var liftWidth = 20;
    var liftSideWallWidth = (liftWallWidth/2)-liftWidth;
	var wall1 = new Wall(liftSideWallWidth,100, new THREE.Vector3(-((liftWallWidth/2)-(liftSideWallWidth/2)),50,-98),"img/brick1.jpg",0x404040);
	var wall2 = new Wall(liftSideWallWidth,100, new THREE.Vector3((liftWallWidth/2)-(liftSideWallWidth/2),50,-98),"img/brick1.jpg",0x404040);
	var wallL = new Wall(200,100, new THREE.Vector3(-98,50,0),"img/sidewall.jpg",0x888888);
	wallL.rotation.y=90 * (Math.PI / 180);
	var wallR = new Wall(200,100, new THREE.Vector3(98,50,0),"img/sidewall.jpg",0x888888);
	wallR.rotation.y=90 * (Math.PI / 180);
	

	var light1Position = new THREE.Vector3(-((liftWallWidth/2)-(liftSideWallWidth/2)),100,-90);
	var light1Target = new THREE.Vector3(-((liftWallWidth/2)-(liftSideWallWidth/2)),10,-98);
	var light2Position = new THREE.Vector3((liftWallWidth/2)-(liftSideWallWidth/2),100,-90);
	var light2Target = new THREE.Vector3((liftWallWidth/2)-(liftSideWallWidth/2),10,-98);

	var spotLight1 = createSpotLight(0xffffff,8,light1Position,light1Target,90);
	var spotLight2 = createSpotLight(0xffffff,8,light2Position,light2Target,90);

	group.add(wall1);
	group.add(wall2);
	group.add(wallL);
	group.add(wallR);
	group.add(spotLight1);
	group.add(spotLight2);

	group.add(createAmbientLight(0x4b4b4b));

    var _mesh = group;
    _mesh.position.y=elevation * FLOOR_HEIGHT;
    var _api = {
        mesh: function() {
            return _mesh;
        }
    };
    return _api;

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