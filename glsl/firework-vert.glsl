attribute vec3 velocity;
uniform float delta;

void main() {
	vec4 pos = vec4(position.x + velocity.x * delta,
					position.y + velocity.y * delta,
					position.z + velocity.z * delta, 1);
	gl_Position = projectionMatrix * modelViewMatrix * pos;
}