var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var fireworks = [];
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

function explode(f) {
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

camera.position.z = 5;

var clock = new THREE.Clock();
var timeSinceFirework = 0;

function updateKin(f, delta) {
	f.mesh.position.x += f.velocity.x * delta;
	f.mesh.position.y += f.velocity.y * delta;
	f.mesh.position.z += f.velocity.z * delta;
	f.velocity.y += -4 * delta;
}

function render() {
	requestAnimationFrame( render );
	var delta = clock.getDelta();
	timeSinceFirework += delta;
	if (Math.random() > .95) {
		var tmp = new firework();
		tmp.material.color = tmp.color;
		scene.add(tmp.mesh);
		fireworks.push(tmp);
		timeSinceFirework = 0;
	}

	for (var i = 0; i < fireworks.length; ++i) {
		var f = fireworks[i];
		f.lifetime += delta;
		if (f.velocity.y < -5) {
			scene.remove(f.mesh);
			fireworks.splice(i, 1);
		}
		if (f.velocity.y < 0.001 && f.explodable) {
			explode(f);
			scene.remove(f.mesh);
			fireworks.splice(i, 1);
		}
		updateKin(f, delta);
	}
	renderer.render( scene, camera );
}
render();