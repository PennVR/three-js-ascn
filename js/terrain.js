function terrain() {
	this.geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
	this.material = new THREE.MeshLambertMaterial( {color: 0x8692a5, wireframe: false, side: THREE.DoubleSide} );
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position = new THREE.Vector3(0, 0, 0);
	this.mesh.position.x = 0;
	this.mesh.position.y = -5;
	this.mesh.position.z = -100;
	this.mesh.rotation.x = -Math.PI / 4;
}