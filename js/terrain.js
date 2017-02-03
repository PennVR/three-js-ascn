function terrain() {
	var width = 100;
	var height = 100;
	this.geometry = new THREE.PlaneGeometry(1000, 1000, width, height);
	this.material = new THREE.MeshLambertMaterial( {vertexColors: THREE.VertexColors,
												    wireframe: false,
												    side: THREE.DoubleSide} );
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position = new THREE.Vector3(0, 0, 0);
	this.mesh.position.x = 0;
	this.mesh.position.y = 0;
	this.mesh.position.z = -100;
	this.mesh.rotation.x = Math.PI / 2;
	for (var i = 0; i < height; ++i) {
		for (var j = 0; j < width; ++j) {
			this.geometry.vertices[i * width + j].z = noise(j, i);
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

var grad = [new THREE.Vector3(1, 1, 0), new THREE.Vector3(-1, 1, 0),
			new THREE.Vector3(1, -1, 0), new THREE.Vector3(-1, -1, 0),
			new THREE.Vector3(1, 0, 1), new THREE.Vector3(-1, 0, 1),
			new THREE.Vector3(1, 0, -1), new THREE.Vector3(-1, 0, -1),
			new THREE.Vector3(0, 1, 1), new THREE.Vector3(0, -1, 1),
			new THREE.Vector3(0, 1, -1), new THREE.Vector3(0, -1, -1)];

function noise(x, y) {
	return random() * 10;
}

function getColor(height) {
	var BLUE = new THREE.Color(0x0000ff);
	var GREEN = new THREE.Color(0x00ff00);
	var WHITE = new THREE.Color(0xffffff);
	if (height >= 0 && height < 5) {
		return WHITE.lerp(GREEN, height / 2);
	} else {
		return GREEN.lerp(BLUE, (height - 5) / 5);
	}
}

var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
