var SIDE_WALLS_DEPTH = 2;
var LIFT_STATIONARY = 0;
var LIFT_MOVING = 1;
var LIFT_DOORS_OPEN = 2;
var LIFT_DOORS_CLOSED = 3;
var LIFT_DOORS_OPENING = 4;
var LIFT_DOORS_CLOSING = 5;
var LIFT_REQUEST_MOVE = 6;

var LiftDuct = function (liftWidth,liftHeight,liftDepth, floorCount, floorHeight) {
	var _mesh = new THREE.Object3D();
	var LIFTCHANNEL_SPACING = 10;
	var LIFTCHANNEL_HEIGHT = floorHeight * floorCount;
	var leftWallPosition = new THREE.Vector3(-1*(liftWidth/2+LIFTCHANNEL_SPACING-WALL_THICKNESS/2),0,-LIFTCHANNEL_SPACING/2);
	var leftWall = new Wall(liftDepth + LIFTCHANNEL_SPACING,LIFTCHANNEL_HEIGHT,leftWallPosition);
	leftWall.rotation.y=-90 * (Math.PI / 180);
	_mesh.add(leftWall);		

	var rightWallPosition = new THREE.Vector3((liftWidth/2+LIFTCHANNEL_SPACING-WALL_THICKNESS/2),0,-LIFTCHANNEL_SPACING/2);
	var rightWall = new Wall(liftDepth + LIFTCHANNEL_SPACING,LIFTCHANNEL_HEIGHT,rightWallPosition);
	rightWall.rotation.y=90 * (Math.PI / 180);
	_mesh.add(rightWall);		

	var backWallPosition = new THREE.Vector3(0,0,-1 * (liftDepth/2 + LIFTCHANNEL_SPACING - WALL_THICKNESS /2));
	var backWall = new Wall(liftWidth + (2 * LIFTCHANNEL_SPACING),LIFTCHANNEL_HEIGHT,backWallPosition);
	_mesh.add(backWall);		

	_mesh.position.y += floorHeight/2 - liftHeight/2;
	

	var _api = {
		mesh: function() {
			return _mesh;
		},
		height: function() {
			return LIFTCHANNEL_HEIGHT;
		}
	};

	return _api;
}

var LiftBox = function(width,height,depth,hasMirrorInBack,SIDE_WALLS_DEPTH)  {
	var liftBox = new THREE.Object3D();
	var mirrorCubeCamera = undefined;
	var liftBackMirror = undefined;

   	var liftTexture = THREE.ImageUtils.loadTexture( "img/liftfloor.gif" );
    liftTexture.wrapS = liftTexture.wrapT = THREE.RepeatWrapping;
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
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
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
        mirrorCubeCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
		mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
		liftBox.add( mirrorCubeCamera );
		var mirrorCubeMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorCubeCamera.renderTarget } );


		liftBackMirror = new THREE.Mesh(new THREE.PlaneGeometry(width,height/2,4,4),mirrorCubeMaterial);
		liftBackMirror.position.set(0,height/6,-(depth-4)/2);
		mirrorCubeCamera.position = liftBackMirror.position;

		liftBox.add(liftBackMirror);
	}
	var _api = {
		mesh: function() {
			return liftBox;
		},
		updateMirror: function(renderer,scene) {
			if (mirrorCubeCamera) {
			    liftBackMirror.visible = false;
			    mirrorCubeCamera.updateCubeMap( renderer, scene );
    			liftBackMirror.visible = true;
			}
		}
	};
	return _api;
}

var Lift = function (width,height,depth,hasMirrorInBack,floorCount, floorHeight) {
	var group = new THREE.Object3D();
	var LIFT_SPEED = 2;
	var liftBox = new LiftBox(width,height,depth,hasMirrorInBack);
	var doors = new LiftDoors(width,height,depth,SIDE_WALLS_DEPTH/2);
	liftBox.mesh().add(doors.mesh());
	group.add(liftBox.mesh());
	// group.add(doors.mesh());

	var liftDuct = new LiftDuct(width,height,depth,floorCount,floorHeight);
	liftDuct.mesh().position.set(0,(liftDuct.height()/2) - (height/2),0);
	group.add(liftDuct.mesh());
	var liftStatus = LIFT_STATIONARY;
	var liftBasePosition = liftBox.mesh().position.y;
	var currentFloorNumber = 0;
	var finalFloorNumber = undefined;

	_api = {
		mesh:function(){
			return group;
		},
		getStatus : function() {
			return liftStatus;
		},
		open : function(nextStep) {
			if (_notMoving()) {
				doors.open(function() {
					liftStatus = LIFT_DOORS_OPEN;
					_addDoorOpenTimeout();
					nextStep();
				});
			}
		},
		close : function() {
			if (_notMoving()) {
				liftStatus = LIFT_DOORS_CLOSING;
				doors.close(function(){
					liftStatus = LIFT_DOORS_CLOSED;		
				});
			}
		},
		requestMove: function(floorNumber) {
			if (doors.areDoorsClosed()) {
				finalFloorNumber = floorNumber;
				liftStatus = LIFT_REQUEST_MOVE;
			}
		},
		height: function() {
			return liftDuct.height();
		},
		update: function(renderer,scene) {
			liftBox.updateMirror(renderer,scene);
			_handleCommand();
		}
	};

	var _notMoving = function() {
		return liftStatus != LIFT_MOVING;
	}

	var _handleCommand = function() {
		switch(liftStatus) {
			// case LIFT_DOORS_OPENING: _open(); 
			// 	break;
			case LIFT_DOORS_CLOSING: _close();
				break;
			case LIFT_DOORS_OPEN: _addDoorOpenTimeout();
				break;
			case LIFT_REQUEST_MOVE: _requestMove();
				break;
			case LIFT_MOVING: _move();
				break;
		}
	}

	var _doorCloseTimerSet = false;

	var _addDoorOpenTimeout = function () {
		if (!_doorCloseTimerSet) {
			var _doorCloseTimer = setTimeout(function() {
				clearTimeout(_doorCloseTimer);
				_api.close();
				_doorCloseTimerSet = false;
			}, 6000);
			_doorCloseTimerSet = true;
		}
	}

	var _open = function() {
		if (_notMoving()) {
			doors.open(function() {
				liftStatus = LIFT_DOORS_OPEN;
				_addDoorOpenTimeout();
			});
		}
		// if (doors.areDoorsOpen()) {
		// 	liftStatus = LIFT_DOORS_OPEN;
		// }
	}
	var _close = function() {
		// if (_notMoving()) {
		// 	doors.close(function(){
		// 		liftStatus = LIFT_DOORS_CLOSED;		
		// 	});
		// }
		// if (doors.areDoorsClosed()) {
		// 	liftStatus = LIFT_DOORS_CLOSED;
		// }
	}

	var _moveUp = function() {
		var liftFinalPosition = finalFloorNumber * floorHeight;
		var liftCurrentPosition = liftBox.mesh().position.y;
		if (liftFinalPosition > liftCurrentPosition) {
			liftBox.mesh().position.y += LIFT_SPEED;
		} else {
			liftStatus = LIFT_STATIONARY;
			_api.open();
		}
	}

	var _moveDown = function() {
		var liftFinalPosition = finalFloorNumber * floorHeight;
		var liftCurrentPosition = liftBox.mesh().position.y;
		if (liftFinalPosition < liftCurrentPosition) {
			liftBox.mesh().position.y -= LIFT_SPEED;
		} else {
			liftStatus = LIFT_STATIONARY;
			_api.open();
		}
	}

	var _move = function() {
		if (doors.areDoorsClosed()) {
			if (currentFloorNumber < finalFloorNumber) {
				_moveUp();
			} else {
				_moveDown();
			}
			// var liftFinalPosition = finalFloorNumber * floorHeight;
			// // if (liftBox.mesh().position.y == 
		}
	}

	var _requestMove = function() {
		if (doors.areDoorsClosed()) {
			liftStatus = LIFT_MOVING;
		}
	}
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

	var doorInnerLeftPosition = new THREE.Vector3(-width/4 - 0.05,0,depth/2);
	var doorInnerRightPosition = new THREE.Vector3(width/4+ 0.05,0,depth/2);
	var doorOutterLeftPosition = new THREE.Vector3(-width/4,0,(depth/2)+thickness+1);
	var doorOutterRightPosition = new THREE.Vector3(width/4,0,(depth/2)+thickness+1);

	var innerLeft = new Door(width/2,height,thickness,innerDoors,doorInnerLeftPosition);    	
	var innerRight = new Door(width/2,height,thickness,innerDoors,doorInnerRightPosition);
	var outterLeft = new Door((width/2)-0.2,height,thickness,metalicMaterial,doorOutterLeftPosition);    	
	var outterRight = new Door((width/2)-0.2,height,thickness,metalicMaterial,doorOutterRightPosition);


	liftDoors.add(innerLeft.mesh());
	liftDoors.add(innerRight.mesh());
	// liftDoors.add(outterLeft.mesh());
	// liftDoors.add(outterRight.mesh());
	var doorSpeed = 0.2;
	var doorPositionBeforeOpen = [];
	var _api = {
	open: function(nextStep) {
		// if(doorOpenWidth < width/2) {
		// 	innerLeft.moveLeft(doorSpeed);
		// 	innerRight.moveRight(doorSpeed);
		// 	if (doorOpenWidth > 0) {
		// 		// outterLeft.moveLeft(doorSpeed);
		// 		// outterRight.moveRight(doorSpeed);
		// 	}
		// 	doorOpenWidth+=doorSpeed;
		// }
		// console.log("Open");
		doorPositionBeforeOpen[0] = innerLeft.mesh().position.x;
		doorPositionBeforeOpen[1] = innerRight.mesh().position.x;

		new TWEEN.Tween(innerLeft.mesh().position).to({x:innerLeft.mesh().position.x-width/2},2000).easing( TWEEN.Easing.Linear.None).start().onComplete(nextStep);
		new TWEEN.Tween(innerRight.mesh().position).to({x:innerRight.mesh().position.x + width/2},2000).easing( TWEEN.Easing.Linear.None).start();
	},
	areDoorsOpen: function () {
		return doorOpenWidth >= width/2;
	},
	areDoorsClosed : function() {
		return doorOpenWidth <= 0;
	},
	mesh: function() {
		return liftDoors;
	},
	close: function(nextStep) {
		// if(doorOpenWidth > 0) {
		// 	innerLeft.moveRight(doorSpeed);
		// 	innerRight.moveLeft(doorSpeed);
		// 	if (doorOpenWidth < width/2) {
		// 		// outterLeft.moveRight(doorSpeed);
		// 		// outterRight.moveLeft(doorSpeed);
		// 	}

		// 	doorOpenWidth-=doorSpeed;
		// }
		new TWEEN.Tween(innerLeft.mesh().position).to({x:doorPositionBeforeOpen[0]},2000).easing( TWEEN.Easing.Linear.None).start().onComplete(nextStep);
		new TWEEN.Tween(innerRight.mesh().position).to({x:doorPositionBeforeOpen[1]},2000).easing( TWEEN.Easing.Linear.None).start().onComplete(nextStep);

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

var LiftIndicator = function() {
	var _mesh = undefined;
	var _init = function() {
		var indicator = new THREE.Object3D();

		
		var indicatorPlateMaterial =
	        new THREE.MeshPhongMaterial({
	        	color:0xB2B2B2,
	        	ambient:0x888888,
	            emissive:0xDDDDDD,
	            specular:0xB2B2B2,
	            shininess: 100
	        });
    	var indicatorPlate = new THREE.Mesh(new THREE.PlaneGeometry(5,2),indicatorPlateMaterial);

    	indicator.add(indicatorPlate);

    	_mesh = indicator;
	}

	_init();

	_api = {
		mesh: function() {
			return _mesh;
		}
	};
	return _api;
}
