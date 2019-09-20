import * as BABYLON from 'babylonjs'
import Atlas from '../../common/Atlas'
//import 'babylonjs-materials'

class BABYLONRenderer {
	constructor() {
		this.engine = new BABYLON.Engine(document.getElementById('main-canvas'), true)
		this.engine.enableOfflineSupport = false
		this.scene = new BABYLON.Scene(this.engine)
		this.scene.collisionsEnabled = true
		this.scene.detachControl() // we're doing our own camera!

		Atlas.load(this.scene, () => {
			console.log('assets not loaded')
		}, () => {
			console.log('assets loaded')
		})

		this.camera = new BABYLON.TargetCamera('camera', new BABYLON.Vector3(0, 0, -10), this.scene)
		this.camera.fov = 1.0
		this.camera.minZ = 0.1

		const light = new BABYLON.HemisphericLight('h', new BABYLON.Vector3(0, 1, 0.5), this.scene)
		light.intensity = 1.0

		const plane = BABYLON.MeshBuilder.CreatePlane('ground', { size: 30 }, this.scene)
		plane.rotation.x = Math.PI * 0.5
		plane.position.y = -1

		this.scene.executeWhenReady(() => { console.log('SCENE READY') })

		// needed for certain shaders, though none in this simple demo
		this.engine.runRenderLoop(() => { })
	}

	drawHitscan(message, color) {
		// shows a red ray for a few frames.. should maybe make a tube or something more visible
		const { sourceId, x, y, z, tx, ty, tz } = message
		const rayhelper = new BABYLON.RayHelper(new BABYLON.Ray(
			new BABYLON.Vector3(x, y, z),
			new BABYLON.Vector3(tx, ty, tz),
		))

		rayhelper.show(this.scene, color)

		setTimeout(() => {
			rayhelper.dispose()
		}, 128)
	}

	update(delta) {
		this.scene.render()
	}
}

export default BABYLONRenderer
