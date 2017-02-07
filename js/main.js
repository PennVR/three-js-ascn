var GUI_VARS = function() {
	this.MAX_PARTICLES = 100;
	this.EXPLODE_PARTICLES = 50;
	this.FADE = true;
	this.FADE_RATE = 2000;
}

var SVARS = new GUI_VARS();

var gui = new dat.GUI();
gui.add(SVARS, 'MAX_PARTICLES');
gui.add(SVARS, 'EXPLODE_PARTICLES');
gui.add(SVARS, 'FADE');
gui.add(SVARS, 'FADE_RATE');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var vr_controls = new THREE.VRControls( camera );
var mouse_controls = new THREE.PointerLockControls( camera );
var effect = new THREE.VREffect( renderer );

if ( WEBVR.isAvailable() === false ) {
	document.body.appendChild( WEBVR.getMessage() );
} else {
	document.body.appendChild( WEBVR.getButton( effect ) );
}


var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

var instructions = document.getElementById( 'instructions' );
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if ( havePointerLock ) {
	var element = document.body;
	var pointerlockchange = function ( event ) {
		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
			controlsEnabled = true;
			mouse_controls.enabled = true;
			blocker.style.display = 'none';
		} else {
			mouse_controls.enabled = false;
			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';
			instructions.style.display = '';
		}
	};
	var pointerlockerror = function ( event ) {
		instructions.style.display = '';
	};
	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
	instructions.addEventListener( 'click', function ( event ) {
		instructions.style.display = 'none';
		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		element.requestPointerLock();
	}, false );
} else {
	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

// add moon 
var spriteMap = new THREE.TextureLoader().load('./res/moon.jpg');
var spriteMaterial = new THREE.SpriteMaterial( {map: spriteMap, color: 0xffffff } );
var sprite = new THREE.Sprite(spriteMaterial);
sprite.position.x = 20;
sprite.position.z = 20;
sprite.position.y = 30;
scene.add(sprite);

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

scene.add(mouse_controls.getObject());

function render() {
	stats.begin();
	effect.requestAnimationFrame( render );
	var delta = clock.getDelta();
	timeSinceFirework += delta;
	var lookAt = camera.getWorldDirection();

	if (effect.isPresenting) {
		// not in vr mode, use mouse to control lookat
		scene.remove(mouse_controls.getObject());
	}

	if (Math.random() > .95 && toExplode < SVARS.MAX_PARTICLES) {
		var tmp = new Firework(true);
		scene.add(tmp.mesh);
		fireworks.push(tmp);
		timeSinceFirework = 0;
		toExplode++;
	}

	for (var i = 0; i < fireworks.length; ++i) {
		var f = fireworks[i];
		f.lifetime += delta;
		if (!f.explodable && SVARS.FADE) {
			f.material.color = f.material.color.lerp(new THREE.Color(0, 0, 0), (1/SVARS.FADE_RATE) * f.lifetime);
		}
		if (f.velocity.y < -5 || f.material.color.equals(new THREE.Color(0, 0, 0))) {
			scene.remove(f.mesh);
			fireworks.splice(i, 1);
		}
		if (f.velocity.y < 0.001 && f.explodable) {
			f.explode();
			toExplode--;
			scene.remove(f.mesh);
			fireworks.splice(i, 1);
		}
		f.updateKin(delta);
	}

	vr_controls.update();
	effect.render( scene, camera );
	stats.end();
}
render();