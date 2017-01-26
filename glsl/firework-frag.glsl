attribute float lifetime;
attribute vec3 customColor;

// If alpha = 0, return p1

// If alpha = 1, return p2
vec3 lerp(vec3 p1, vec3 p2, float alpha) {
	return (p1 * (1.0 - alpha) + (p2 * alpha));
}

void main() {
	//gl_FragColor = vec4(lerp(customColor, vec3(0, 0, 0), 0));
	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
}