var createSpotLight = function(color,intensity,position,target,distance) {
	var group = new THREE.Object3D();

	var spotLight = new THREE.SpotLight( color,intensity );
	spotLight.position = position;
	spotLight.target.position = target;
	spotLight.distance = distance;
	spotLight.angle = 0.7;
	spotLight.castShadow = true;

	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;

	spotLight.shadowCameraNear = 1;
	spotLight.shadowCameraFar = 400;
	spotLight.shadowCameraFov = 30;
	spotLight.castShadow = true;

	var sphere = new THREE.SphereGeometry(2);
	var sphereMesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color:color}));
	sphereMesh.position = position;
	
	group.add(spotLight);
	group.add(sphereMesh);
	return group;
}

var createAmbientLight = function(color){
    var light = new THREE.AmbientLight(color); // soft white light
    return light;
}

var createDirectionalLight = function(position) {
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position = position;
	return directionalLight;
}