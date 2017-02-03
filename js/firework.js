function firework() {
	this.geometry = new THREE.SphereGeometry(0.02, 0.02, 0.02);
	this.material = new THREE.PointsMaterial();
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.color = new THREE.Color( (Math.random() + 1) / 2, (Math.random() + 1) / 2, (Math.random() + 1) / 2 );
	this.color = new THREE.Color(Math.random(), Math.random(), Math.random());
	this.mesh.position = new THREE.Vector3( 0, 0, 0 );
	var radius = Math.random() * 100 + 400; // radius^2 from 10 to 20
	var theta = Math.random() * 2 * Math.PI; // random angle;
	this.mesh.position.x = camera.position.x + Math.sqrt(radius) * Math.cos(theta);
	this.mesh.position.y = camera.position.y - 7;
	this.mesh.position.z = camera.position.z + Math.sqrt(radius) * Math.sin(theta);
	this.velocity = new THREE.Vector3( 0, Math.random() * 5 + 15, 0 );
	this.lifetime = 0;
	this.explodable = true;
}

function flash(parent) {
	this.light = new THREE.PointLight( 0xffffff, .5, 1000, 2);
	this.light.color = parent.color;
	this.light.position.set(parent.mesh.position);
	this.lifetime = 0;
}

var booms = [];
for (var i = 0; i < 100; ++i) {
	booms.push(new Audio('./boom.mp3'));
}
function explode(f) {
	for (var i = 0; i < EXPLODE_PARTICLES; ++i) {
		var tmp = new firework();
		tmp.mesh.position.x = f.mesh.position.x;
		tmp.mesh.position.y = f.mesh.position.y;
		tmp.mesh.position.z = f.mesh.position.z;
		tmp.velocity = new THREE.Vector3(
			Math.random() * 3 - 1.5, Math.random() * 4 - 1, Math.random() * 3 - 1.5);
		tmp.color = f.color;
		tmp.material.color = f.color;
		tmp.explodable = false;
		f.explodable = false;
		scene.add(tmp.mesh);
		fireworks.push(tmp);
	}
	//booms[Math.floor(Math.random() * 100)].play();
}

function updateKin(f, delta) {
	f.mesh.position.x += f.velocity.x * delta;
	f.mesh.position.y += f.velocity.y * delta;
	f.mesh.position.z += f.velocity.z * delta;
	f.velocity.y += -4 * delta;
}