function firework() {
	this.geometry = new THREE.SphereBufferGeometry(1, 1, 1);
	this.velocities = new Float32Array([
		Math.random() * 10 - 5, 9, Math.random() * 5 - 2.5]);
	this.lifetime = new Float32Array([0]);
	this.color = new Float32Array([
		(Math.random() + 1) / 2, (Math.random() + 1) / 2, (Math.random() + 1) / 2 ]);
	this.geometry.addAttribute('velocity', new THREE.BufferAttribute(this.velocities, 3));
	this.geometry.addAttribute('lifetime', new THREE.BufferAttribute(this.lifetime, 1));
	this.geometry.addAttribute('customColor', new THREE.BufferAttribute(this.color, 3));
	this.material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: require(['js/text!../glsl/firework-vert.glsl']),
		fragmentShader: require(['js/text!../glsl/firework-frag.glsl'])
	} );
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
	if (svars.EXPLODE_MOMENTUM) {
	var new_v = [];
	for (var i = 0; i < svars.EXPLODE_PARTICLES - 1; ++i) {
		new_v[i] = new THREE.Vector3(
			Math.random() * 3 - 1.5, Math.random() * 4 - 1, Math.random() * 3 - 1.5);
	}
	var sum = new THREE.Vector3(0, 0, 0);
	for (var i = 0; i < svars.EXPLODE_PARTICLES - 1; ++i) {
		sum = sum.add(new_v[i]);
	}
	new_v[svars.EXPLODE_PARTICLES - 1] = f.velocity.multiplyScalar(svars.EXPLODE_PARTICLES).sub(sum);
	}
	var l = new flash(f);
	fireworkLights.push(l);
	scene.add(l.light);
	for (var i = 0; i < svars.EXPLODE_PARTICLES; ++i) {
		var tmp = new firework();
		tmp.mesh.position.x = f.mesh.position.x;
		tmp.mesh.position.y = f.mesh.position.y;
		tmp.mesh.position.z = f.mesh.position.z;
		if (svars.EXPLODE_MOMENTUM) {
			tmp.velocity = new_v[i];
		} else {
			tmp.velocity = new THREE.Vector3(
				Math.random() * 3 - 1.5, Math.random() * 4 - 1, Math.random() * 3 - 1.5);
		}
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