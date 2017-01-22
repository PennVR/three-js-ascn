var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

function clamp(val, min, max) {
	if (val < min) { return min; }
	else if (val > max) { return max; }
	else { return val; }
}

// initialize terrain
var t = new terrain();
scene.add(t.mesh);

var fireworks = [];
var fireworkLights = [];

camera.position.z = 5;

var clock = new THREE.Clock();
var timeSinceFirework = 0;
var toExplode = 0;

function render() {
	stats.begin();
	requestAnimationFrame( render );
	var delta = clock.getDelta();
	timeSinceFirework += delta;
	
	if (Math.random() > .99 && toExplode < 5) {
		var tmp = new firework();
		tmp.material.color = tmp.color;
		scene.add(tmp.mesh);
		fireworks.push(tmp);
		timeSinceFirework = 0;
		toExplode++;
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
			toExplode--;
			scene.remove(f.mesh);
			fireworks.splice(i, 1);
		}
		updateKin(f, delta);
	}

	for (var i = 0; i < fireworkLights.length; ++i) {
		var l = fireworkLights[i];
		l.lifetime += delta;
		l.light.intensity = clamp(1/(l.lifetime*2), 0, .5);
		if (l.lifetime > 5) {
			scene.remove(l.light);
			fireworkLights.splice(i, 1);
		}
	}

	renderer.render( scene, camera );
	stats.end();
}
render();