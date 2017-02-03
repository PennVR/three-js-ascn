var MAX_PARTICLES = 100;
var EXPLODE_PARTICLES = 50;
var FADE = true;
var FADE_RATE = 2000;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new THREE.VRControls( camera );
var effect = new THREE.VREffect( renderer );

if ( WEBVR.isAvailable() === false ) {
	document.body.appendChild( WEBVR.getMessage() );
} else {
	document.body.appendChild( WEBVR.getButton( effect ) );
}


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

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
scene.add( directionalLight );

var fireworks = [];
var fireworkLights = [];

camera.position.y = 0;

var clock = new THREE.Clock();
var timeSinceFirework = 0;
var toExplode = 0;

function render() {
	stats.begin();
	effect.requestAnimationFrame( render );
	var delta = clock.getDelta();
	timeSinceFirework += delta;
	var lookAt = camera.getWorldDirection();

	camera.position.x += lookAt.x * .1;
	camera.position.z += lookAt.z * .1;

	if (Math.random() > .95 && toExplode < MAX_PARTICLES) {
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
		if (!f.explodable && FADE) {
			f.material.color = f.material.color.lerp(new THREE.Color(0, 0, 0), (1/FADE_RATE) * f.lifetime);
		}
		if (f.velocity.y < -5 || f.material.color.equals(new THREE.Color(0, 0, 0))) {
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
		l.light.intensity = clamp(1/(l.lifetime*2), 0, 1);
		if (l.lifetime > 5) {
			scene.remove(l.light);
			fireworkLights.splice(i, 1);
		}
	}
	controls.update();
	effect.render( scene, camera );
	stats.end();
}
render();