class Firework {
	constructor(isExplodable) {
		this.geometry = new THREE.SphereGeometry(0.02, 0.02, 0.02);
		this.material = new THREE.PointsMaterial();
		this.material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		var r = Math.random() * 100 + 400;
		var t = Math.random() * 2 * Math.PI;
		this.mesh.position.set (camera.position.x + Math.sqrt(r) * Math.cos(t),
								camera.position.y - 7,
								camera.position.z + Math.sqrt(r) * Math.sin(t));
		this.velocity = new THREE.Vector3(Math.random() * 2, Math.random() * 5 + 15, Math.random() * 2);
		this.lifetime = 0;
		this.explodable = isExplodable;
	}

	explode() {
		for (var i = 0; i < SVARS.EXPLODE_PARTICLES; ++i) {
			var tmp = new Firework(false);
			tmp.mesh.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
			tmp.velocity = new THREE.Vector3(
				Math.random() * 3 - 1.5, Math.random() * 4 - 1, Math.random() * 3 - 1.5);
			tmp.material.color = this.material.color;
			this.explodable = false;
			scene.add(tmp.mesh);
			fireworks.push(tmp);
		}
	}

	updateKin(delta) {
		this.mesh.position.x += this.velocity.x * delta;
		this.mesh.position.y += this.velocity.y * delta;
		this.mesh.position.z += this.velocity.z * delta;
		this.velocity.y += -4 * delta;
	}

}