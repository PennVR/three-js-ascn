function firework() {
	this.geometry = new THREE.SphereGeometry(0.02, 0.02, 0.02);
	this.material = new THREE.PointsMaterial();
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.color = new THREE.Color( (Math.random() + 1) / 2, (Math.random() + 1) / 2, (Math.random() + 1) / 2 );
	this.mesh.position = new THREE.Vector3( 0, 0, 0 );
	this.mesh.position.x = Math.random() * 8 - 4;
	this.mesh.position.y = -7;
	this.mesh.position.z = -5;
	this.velocity = new THREE.Vector3( Math.random() * 10 - 5, 9, Math.random() * 5 - 2.5 );
	this.lifetime = 0;
	this.explodable = true;
}

function flash(parent) {
	this.light = new THREE.PointLight( 0xffffff, .5, 1000, 2);
	this.light.color = parent.color;
	this.light.position.set(parent.mesh.position);
	this.lifetime = 0;
}

function explode(f) {
	var l = new flash(f);
	fireworkLights.push(l);
	scene.add(l.light);
	for (var i = 0; i < 10; ++i) {
		var tmp = new firework();
		tmp.mesh.position.x = f.mesh.position.x;
		tmp.mesh.position.y = f.mesh.position.y;
		tmp.mesh.position.z = f.mesh.position.z;
		tmp.velocity = new THREE.Vector3( Math.random() * 4 - 2, Math.random() * 2 + 1, Math.random() * 4 - 2 );
		tmp.color = f.color;
		tmp.material.color = f.color;
		tmp.explodable = false;
		f.explodable = false;
		scene.add(tmp.mesh);
		fireworks.push(tmp);
	}
}

function updateKin(f, delta) {
	f.mesh.position.x += f.velocity.x * delta;
	f.mesh.position.y += f.velocity.y * delta;
	f.mesh.position.z += f.velocity.z * delta;
	f.velocity.y += -4 * delta;
}