var createAxis=function(src,dst,colorHex,dashed){
    var geom = new THREE.Geometry(),
        mat; 

    if(dashed) {
        mat = new THREE.LineDashedMaterial(
            { 
                linewidth: 3, 
                color: colorHex, 
                dashSize: 3, 
                gapSize: 3 
             });
    } 
    else {
        mat = new THREE.LineBasicMaterial(
            { 
                linewidth: 3, 
                color: colorHex 
            });
    }

    geom.vertices.push( src.clone() );
    geom.vertices.push( dst.clone() );
    // This one is SUPER important, otherwise 
    // dashed lines will appear as simple plain 
    // lines
    geom.computeLineDistances(); 

    var axis = new THREE.Line( 
        geom, mat, THREE.LinePieces );

    return axis;
}
var createAxes = function(length) {
    var axes = new THREE.Object3D();

    axes.add( createAxis( 
        new THREE.Vector3( 0, 0, 0 ), 
        new THREE.Vector3( length, 0, 0 ), 
        'red', false ) ); // +X

    axes.add( createAxis( 
        new THREE.Vector3( 0, 0, 0 ), 
        new THREE.Vector3( -length, 0, 0 ), 
        'red', true) ); // -X

    axes.add( createAxis( 
        new THREE.Vector3( 0, 0, 0 ), 
        new THREE.Vector3( 0, length, 0 ), 
        'blue', false ) ); // +Y

    axes.add( createAxis( 
        new THREE.Vector3( 0, 0, 0 ), 
        new THREE.Vector3( 0, -length, 0 ),
        'blue', true ) ); // -Y

    axes.add( createAxis( 
        new THREE.Vector3( 0, 0, 0 ), 
        new THREE.Vector3( 0, 0, length ), 
        'green', false ) ); // +Z

    axes.add( createAxis( 
        new THREE.Vector3( 0, 0, 0 ), 
        new THREE.Vector3( 0, 0, -length ), 
        'green', true ) ); // -Z

     return axes;
}