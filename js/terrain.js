var WIDTH_SEGMENTS = 100;
var HEIGHT_SEGMENTS = 100;

function terrain() {
	this.geometry = new THREE.PlaneGeometry(1000, 1000, WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
	this.material = new THREE.MeshLambertMaterial( {vertexColors: THREE.VertexColors,
												    wireframe: false,
												    side: THREE.DoubleSide} );
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position = new THREE.Vector3(0, 0, 0);
	this.mesh.position.x = 0;
	this.mesh.position.y = 0;
	this.mesh.position.z = -100;
	this.mesh.rotation.x = Math.PI / 2;
	for (var i = 0; i < HEIGHT_SEGMENTS; ++i) {
		for (var j = 0; j < WIDTH_SEGMENTS; ++j) {
			this.geometry.vertices[i * WIDTH_SEGMENTS + j].z = noise(j, i);
		}
	}
	for (var i = 0; i < this.geometry.faces.length; ++i) {
		var face = this.geometry.faces[i];
		var v1 = face.a;
		var v2 = face.b;
		var v3 = face.c;
		this.geometry.faces[i].vertexColors.push(getColor(this.geometry.vertices[v1].z));
		this.geometry.faces[i].vertexColors.push(getColor(this.geometry.vertices[v2].z));
		this.geometry.faces[i].vertexColors.push(getColor(this.geometry.vertices[v3].z));
	}
	this.geometry.verticesNeedUpdate = true;
	this.geometry.elementsNeedUpdate = true;
}

var grad = [new THREE.Vector2(1, 1), new THREE.Vector2(-1, 1),
			new THREE.Vector2(1, -1), new THREE.Vector2(-1, -1),
			new THREE.Vector2(1, 0), new THREE.Vector2(-1, 0),
			new THREE.Vector2(0, 1), new THREE.Vector2(0, -1)];

var seed = 1;
function noise(x, y) {
	// get unit square we are in
	var x_norm = x * 256 / WIDTH_SEGMENTS;
	var y_norm = y * 256 / HEIGHT_SEGMENTS;
	var x_floor = Math.floor(x_norm);
	var x_ceil = Math.ceil(x_norm);
	var y_floor = Math.floor(y_norm);
	var y_ceil = Math.ceil(y_norm);

	// get distance vectors
	var distBL = new THREE.Vector2(x_norm - x_floor, y_norm - y_floor);
	var distBR = new THREE.Vector2(x_ceil - x_norm, y_norm - y_floor);
	var distUR = new THREE.Vector2(x_ceil - x_norm, y_ceil - y_norm);
	var distUL = new THREE.Vector2(x_norm - x_floor, y_ceil - y_norm);

	// get gradient vectors of the unit square
	// var BL_grad = new THREE.Vector2(Math.random(), Math.random());
	// var BR_grad = new THREE.Vector2(Math.random(), Math.random());
	// var UR_grad = new THREE.Vector2(Math.random(), Math.random());
	// var UL_grad = new THREE.Vector2(Math.random(), Math.random());
	var BL_grad = grad[gradHash(y_floor * 256 + x_floor)];
	var BR_grad = grad[gradHash(y_floor * 256 + x_ceil)];
	var UR_grad = grad[gradHash(y_ceil * 256 + x_ceil)];
	var UL_grad = grad[gradHash(y_ceil * 256 + x_floor)];

	var dotBL = BL_grad.dot(distBL);
	var dotBR = BR_grad.dot(distBR);
	var dotUR = UR_grad.dot(distUR);
	var dotUL = UL_grad.dot(distUL);

	var lerp1 = lerp(dotBL, dotBR, (x_norm - x_floor));
	var lerp2 = lerp(dotUL, dotUR, (x_norm - x_floor));
	return lerp(lerp1, lerp2, (y_norm - y_floor)) * 10;
}

function lerp(a, b, x) {
	return a + x * (b - a);
}

function ease(t) {
	return 6*Math.pow(t, 5) - 15*Math.pow(t, 4) + 10*Math.pow(t, 3);
}

function getColor(height) {
	height = -height;
	var BLUE = new THREE.Color(0x5196ff);
	var GREEN = new THREE.Color(0x7cff81);
	var WHITE = new THREE.Color(0xeeeeee);
	if (height < 5) {
		return BLUE.lerp(GREEN, height * 2);
	} else {
		return GREEN.lerp(WHITE, (height -5 ) / 5);
	}
}

var gradSeed = Math.random() * 100;
function gradHash(hash) {
	var x = Math.abs(Math.floor(Math.sin(hash) * gradSeed));
	return x % 8;
}

function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
