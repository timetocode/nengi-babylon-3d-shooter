import BABYLONRenderer from './graphics/BABYLONRenderer'
import InputSystem from './InputSystem'
import MoveCommand from '../common/command/MoveCommand'
import FireCommand from '../common/command/FireCommand'
import createFactories from './factories/createFactories'
import reconcilePlayer from './reconcilePlayer'
import applyCommand from '../common/applyCommand'
import { fire } from '../common/weapon'

// ignoring certain data from the sever b/c we will be predicting these properties on the client
const ignoreProps = ['x', 'y', 'z']
const shouldIgnore = (myId, update) => {
	if (update.nid === myId) {
		if (ignoreProps.indexOf(update.prop) !== -1) {
			return true
		}
	}
	return false
}

class Simulator {
	constructor(client) {
		this.client = client
		this.renderer = new BABYLONRenderer()
		this.input = new InputSystem()
		this.obstacles = new Map()

		this.myRawId = -1
		this.mySmoothId = -1

		this.myRawEntity = null
		this.mySmoothEntity = null

		client.factory = createFactories({
			/* dependency injection */
			simulator: this,
		})

		client.entityUpdateFilter = (update) => {
			return shouldIgnore(this.myRawId, update)
		}

		client.on('message::Identity', message => {
			// these are the ids of our two entities.. we just store them here on simulator until
			// we receive these entities over the network (see: createPlayerFactory)
			this.myRawId = message.rawId
			this.mySmoothId = message.smoothId
			console.log('identified as', message)
		})

		client.on('message::WeaponFired', message => {
			if (message.sourceId === this.mySmoothEntity.nid) {
				// hide our own shots.. we'll predict those instead
				return
			}
			this.renderer.drawHitscan(message, new BABYLON.Color3(1, 0, 0))
		})

		client.on('predictionErrorFrame', predictionErrorFrame => {
			reconcilePlayer(predictionErrorFrame, this.client, this.myRawEntity)
		})

		this.input.onmousemove = (e) => {
			// DIY camera control, first person shooter style
			this.renderer.camera.rotation.x += e.movementY * 0.001 // sens
			this.renderer.camera.rotation.y += e.movementX * 0.001

			// prevent us from doing flips
			if (this.renderer.camera.rotation.x > Math.PI * 0.499) {
				this.renderer.camera.rotation.x = Math.PI * 0.499
			}

			if (this.renderer.camera.rotation.x < -Math.PI * 0.499) {
				this.renderer.camera.rotation.x = -Math.PI * 0.499
			}
		}
	}

	update(delta) {
		const input = this.input.frameState
		this.input.releaseKeys()

		/* all of this is just for our own entity */
		if (this.myRawEntity) {
			// which way are we pointing?
			const camRay = this.renderer.camera.getForwardRay().direction

			/* begin movement */
			const { forwards, left, backwards, right, jump } = input
			const moveCommand = new MoveCommand({
				camRayX: camRay.x,
				camRayY: camRay.y,
				camRayZ: camRay.z,
				forwards, backwards, left, right, jump,
				delta
			})
			// send moveCommand to the server
			this.client.addCommand(moveCommand)

			// apply moveCommand  to our local entity
			applyCommand(this.myRawEntity, moveCommand)

			// save the result of applying the command as a prediction
			const prediction = {
				nid: this.myRawEntity.nid,
				x: this.myRawEntity.x,
				y: this.myRawEntity.y,
				z: this.myRawEntity.z
			}
			this.client.addCustomPrediction(this.client.tick, prediction, ['x', 'y', 'z'])

			// move the camera to our entity
			Object.assign(this.renderer.camera.position, this.myRawEntity.mesh.position)

			/* shooting */
			if (input.mouseDown) {
				const ray = fire(this.myRawEntity)
				if (ray) {
					// send shot to the server
					this.client.addCommand(new FireCommand())

					// defines the ray on our client in a format compatible with 'drawHitscan'
					const spec = {
						x: this.myRawEntity.x,
						y: this.myRawEntity.y,
						z: this.myRawEntity.z,
						tx: ray.direction.x,
						ty: ray.direction.y,
						tz: ray.direction.z,
					}
					// draw a predicted shot locally
					this.renderer.drawHitscan(spec, new BABYLON.Color3(1, 0, 1))
				}
			}
		}

		this.renderer.update()
	}
}

export default Simulator
