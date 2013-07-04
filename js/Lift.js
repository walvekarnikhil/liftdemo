var SlidingDoor = function() {
	var group = new THREE.Object3D();

	return group;
}


var Lift = function (width,height,depth,hasMirrorInBack,scene) {
	var group = new THREE.Object3D();
	var SIDE_WALLS_DEPTH = 2;

	var createLiftBox = function (width,height,depth,hasMirrorInBack,scene) {
		var liftBox = new THREE.Object3D();

       	var liftTexture = THREE.ImageUtils.loadTexture( "img/liftfloor.gif" );
	    // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	    liftTexture.wrapS = THREE.RepeatWrapping;
		liftTexture.wrapT = THREE.RepeatWrapping;
	    liftTexture.format = THREE.RGBFormat;
	    liftTexture.repeat.set(80,80);
		var metalicMaterial = 
        new THREE.MeshPhongMaterial(
            {
            	color:0xFFFFFF,
            	ambient:0x000000,
                emissive:0x7D7DA1,
                specular:0xFFFFFF,
                shininess: 100,
                map:liftTexture
            });
       	var texture = THREE.ImageUtils.loadTexture( "img/liftfloor.gif" );
	    // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	    texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
	    texture.format = THREE.RGBFormat;

		var floorMaterial = 
        new THREE.MeshPhongMaterial(
            {
                ambient:0x888888,
                emissive:0x888888,
                map: texture,
                side:THREE.DoubleSide 
            });

		var ceilMaterial = 
        new THREE.MeshPhongMaterial(
            {
            	color:0xFFFFFF,
            	ambient:0xdddddd,
                emissive:0xCCCCCC,
                specular:0xFFFFFF,
                shininess: 60
            });
    
    	var liftBack = new THREE.Mesh(new THREE.CubeGeometry(width,height,SIDE_WALLS_DEPTH),metalicMaterial);
    	liftBack.position.set(0,0,-depth/2);
    	var liftLeft = new THREE.Mesh(new THREE.CubeGeometry(depth,height,SIDE_WALLS_DEPTH),metalicMaterial);
    	liftLeft.position.set(-width/2,0,0);
		liftLeft.rotation.y=-90 * (Math.PI / 180);

    	var liftRight = new THREE.Mesh(new THREE.CubeGeometry(depth,height,SIDE_WALLS_DEPTH),metalicMaterial);
    	liftRight.position.set(width/2,0,0);
		liftRight.rotation.y=90 * (Math.PI / 180);

    	var liftTop = new THREE.Mesh(new THREE.PlaneGeometry(width,depth,4,4),ceilMaterial);
    	liftTop.position.set(0,height/2,0);
		liftTop.rotation.x=90 * (Math.PI / 180);
    	var liftFloor = new THREE.Mesh(new THREE.PlaneGeometry(width,depth,4),floorMaterial);
    	liftFloor.position.set(0,-height/2,0);
		liftFloor.rotation.x=-90 * (Math.PI / 180);
	    texture.repeat.set(4,4);

		var light1Position = new THREE.Vector3(-width/4,height/2,0);
		var light1Target = new THREE.Vector3(-width/4,0,0);
		var light2Position = new THREE.Vector3(width/4,height/2,0);
		var light2Target = new THREE.Vector3(width/4,0,0);

		var spotLight1 = createSpotLight(0xFFFFFF,4,light1Position,light1Target,100);
		var spotLight2 = createSpotLight(0xFFFFFF,4,light2Position,light2Target,100);



    	liftBox.add(liftBack);
    	liftBox.add(liftLeft);
    	liftBox.add(liftRight);
    	liftBox.add(liftTop);
    	liftBox.add(liftFloor);
  //   	liftBox.add(createDirectionalLight(light1Position));
		liftBox.add(spotLight1);
		liftBox.add(spotLight2);

		if (hasMirrorInBack) {
			var mirrorMaterial = new THREE.MeshPhongMaterial(
            {
            	color:0xFFFFFF,
            	ambient:0xdddddd,
                emissive:0xCCCCCC,
                specular:0xFFFFFF,
                shininess: 60
            });
            var mirrorCubeCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
			mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
			scene.add( mirrorCubeCamera );
			var mirrorCubeMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorCubeCamera.renderTarget } );
	

    		var liftBackMirror = new THREE.Mesh(new THREE.PlaneGeometry(width,height/2,4,4),mirrorCubeMaterial);
    		liftBackMirror.position.set(0,height/6,-(depth-4)/2);
    		mirrorCubeCamera.position = liftBackMirror.position;
			// liftBackMirror.rotation.x=-90 * (Math.PI / 180);

			liftBox.add(liftBackMirror);
		}

    	return liftBox;
	}

	var createListDoors = function(width,height,depth) {
	}

	group.add(createLiftBox(width,height,depth,hasMirrorInBack,scene));
	var doors = new LiftDoors(width,height,depth,SIDE_WALLS_DEPTH/2);
	group.add(doors.mesh());
	_api = {
		mesh:function(){
			return group;
		},
		open : function() {
			doors.open();
		},
		close : function() {
			doors.close();
		}
	};
	return _api;
}
var LiftDoors = function(width,height,depth,thickness) {
	var liftDoors = new THREE.Object3D();
	var doorOpenWidth = 0;
	var liftTexture = THREE.ImageUtils.loadTexture( "img/liftfloor.gif" );
    // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    liftTexture.wrapS = THREE.RepeatWrapping;
	liftTexture.wrapT = THREE.RepeatWrapping;
    liftTexture.format = THREE.RGBFormat;
    liftTexture.repeat.set(80,80);
	var metalicMaterial = 
    new THREE.MeshPhongMaterial(
        {
        	color:0xFFFFFF,
        	ambient:0x888888,
            emissive:0xDDDDDD,
            specular:0xFFFFFF,
            shininess: 100,
            map:liftTexture
        });
    var innerDoors = new THREE.MeshPhongMaterial(
        {
        	color:0xFFFFFF,
        	ambient:0x000000,
            emissive:0xAAAAAA,
            specular:0xAAAAAA,
            shininess: 100,
            map:liftTexture
        });

	var doorInnerLeftPosition = new THREE.Vector3(-width/4,0,depth/2);
	var doorInnerRightPosition = new THREE.Vector3(width/4,0,depth/2);
	var doorOutterLeftPosition = new THREE.Vector3(-width/4,0,(depth/2)+thickness+1);
	var doorOutterRightPosition = new THREE.Vector3(width/4,0,(depth/2)+thickness+1);

	var innerLeft = new Door(width/2,height,thickness,innerDoors,doorInnerLeftPosition);    	
	var innerRight = new Door(width/2,height,thickness,innerDoors,doorInnerRightPosition);
	var outterLeft = new Door((width/2)-1,height,thickness,metalicMaterial,doorOutterLeftPosition);    	
	var outterRight = new Door((width/2)-1,height,thickness,metalicMaterial,doorOutterRightPosition);


	liftDoors.add(innerLeft.mesh());
	liftDoors.add(innerRight.mesh());
	liftDoors.add(outterLeft.mesh());
	liftDoors.add(outterRight.mesh());
	var doorSpeed = 0.2;
	var _api = {
	open: function() {
		if(doorOpenWidth < width/2) {
			innerLeft.moveLeft(doorSpeed);
			innerRight.moveRight(doorSpeed);
			if (doorOpenWidth > 0) {
				outterLeft.moveLeft(doorSpeed);
				outterRight.moveRight(doorSpeed);
			}
			doorOpenWidth+=doorSpeed;

		}
	},
	mesh: function() {
		return liftDoors;
	},
	close: function() {
		if(doorOpenWidth > 0) {
			innerLeft.moveRight(doorSpeed);
			innerRight.moveLeft(doorSpeed);
			if (doorOpenWidth < width/2) {
				outterLeft.moveRight(doorSpeed);
				outterRight.moveLeft(doorSpeed);
			}

			doorOpenWidth-=doorSpeed;
		}
	}
	}
	return _api;
}
var Door = function(width,height,thickness,material,position) {
	var _mesh = new THREE.Mesh(new THREE.CubeGeometry(width,height,thickness),material);
	_mesh.position = position;
	var _api = {
		mesh : function() {
			return _mesh;
		},
		moveLeft : function(value) {
			_mesh.position.x -= value;
		},
		moveRight : function(value) {
			_mesh.position.x += value;
		}
	};
	return _api;
}

