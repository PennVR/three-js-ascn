# Alexander Chan
### ascn: Three.js Fireworks

[Link to project](https://pennvr.github.io/three-js-ascn)

No special setup is needed - simply open `index.html`.

In the project, I used Perlin noise for randomly generated terrain. To show the terrain height, I use vertex coloring, linearly interpolating the color between blue, green, and white based on height. Fireworks are randomly spawned in a torus around the camera, so that in VR mode, there will be fireworks regardless of which direction the camera is facing. When a firework explodes, the color of each individual particle is averaged with white to make it appear brighter, to mimic a flash without actually spawning a pointlight, which is much more expensive.

When using the headset, there is no motion sickness as the camera does not move in the scene.

The hardest part of this project was figuring out how to deform the ground plane correctly and properly color the vertices.

If I redid this project, I would have used shaders for the fireworks as well as the terrain. Doing the fireworks on the GPU would greatly raise the number of fireworks on screen at once, as well as the number of particles each firework explodes into. In addition, I would have added infinite terrain.

I wish there was some explanation on the use of shaders with Three.js. I had initially attempted to write shader based fireworks, however, while my shader code was valid, I could not get it to work with Three.js.