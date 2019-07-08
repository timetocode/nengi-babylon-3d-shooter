import nengi from 'nengi'
import * as BABYLON from 'babylonjs'

const c = new BABYLON.Color4(1, 1, 0)
const faceColors = [c, c, c, c, c, c]

class Obstacle {
    constructor() {
		this.mesh = BABYLON.MeshBuilder.CreateBox('obstacle', { size: 3, faceColors })
		this.mesh.checkCollisions = true
	}

	get x() { return this.mesh.position.x }
	set x(value) { this.mesh.position.x = value }

	get y() { return this.mesh.position.y }
	set y(value) { this.mesh.position.y = value }

	get z() { return this.mesh.position.z }
	set z(value) { this.mesh.position.z = value }
}

Obstacle.protocol = {
	x: { type: nengi.Float32, interp: true },
	y: { type: nengi.Float32, interp: true },
	z: { type: nengi.Float32, interp: true },
}

export default Obstacle
