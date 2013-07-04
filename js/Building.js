var Building = function() {
	var FLOOR_HEIGHT = 100;

	var createLobby = function() {
	    var floorPlanGeometry = new THREE.PlaneGeometry(200,100);
	    var texture = THREE.ImageUtils.loadTexture( "img/lobby.jpg" );
	    texture.wrapS = THREE.RepeatWrapping;
	    texture.wrapT = THREE.RepeatWrapping;
	    texture.format = THREE.RGBFormat;
	    var material =
	        new THREE.MeshPhongMaterial({
	            map: texture,
	            side:THREE.DoubleSide,
	            emissive: 0xFFFFFF,
	        });
	    var object = new THREE.Mesh(floorPlanGeometry,material);
	    object.position.set(0,25,100);
	    return object;
	}


	var buildingObjects = new THREE.Object3D();

	var liftHeight = FLOOR_HEIGHT - (FLOOR_HEIGHT/4);
	var lift = new Lift(40,liftHeight,40,true);
	lift.mesh().position.set(0,FLOOR_HEIGHT/4-((FLOOR_HEIGHT/2)-(liftHeight/2)),-120);
	var liftCutOut = new THREE.Mesh(new THREE.CubeGeometry(
	        40,liftHeight,10));
	liftCutOut.position.set(0,-1 * (FLOOR_HEIGHT- liftHeight)/2,0);
	buildingObjects.add(lift.mesh());

	var floor1 = new Floor(0,FLOOR_HEIGHT,liftCutOut);
	floor1.mesh().position.y=-FLOOR_HEIGHT/4;
	buildingObjects.add(floor1.mesh());

	var lobby = createLobby();
	buildingObjects.add(lobby);

	var _mesh = buildingObjects;
	var _api = {
		mesh : function () {
			return _mesh;
		},
		updateMirror: function(renderer,scene) {
			lift.updateMirror(renderer,scene);
		},
		liftOpen : function(){
			lift.open();
		},
		liftClose: function() {
			lift.close();
		}
	};

	return _api;
}