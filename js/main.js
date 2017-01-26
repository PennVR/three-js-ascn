var SCENE_VARS = function() {
	this.EXPLODE_PARTICLES = 25;
	this.FADE = true;
	this.FADE_RATE = 1000;
	this.EXPLODE_MOMENTUM = false;
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

var svars = new SCENE_VARS();
var gui = new dat.GUI();
gui.add(svars, 'EXPLODE_PARTICLES');
gui.add(svars, 'FADE');
gui.add(svars, 'FADE_RATE');
gui.add(svars, 'EXPLODE_MOMENTUM');

function clamp(val, min, max) {
	if (val < min) { return min; }
	else if (val > max) { return max; }
	else { return val; }
}

var uniforms = {
	delta: { value: 0 }
};

// initialize terrain
var t = new terrain();
scene.add(t.mesh);

var fireworks = [];
var fireworkLights = [];

camera.position.z = 5;

var clock = new THREE.Clock();
var timeSinceFirework = 0;
var toExplode = 0;
var f;
function render() {
	stats.begin();
	requestAnimationFrame( render );
	var delta = clock.getDelta();
	uniforms.delta.value = delta;

	if (Math.random() < .90) {
		f = new firework();
		//scene.add(f.mesh);
	}

	renderer.render( scene, camera );
	stats.end();
}
render();