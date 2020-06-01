import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import PlayerCharacter from '../common/entity/PlayerCharacter'
import Identity from '../common/message/Identity'
import WeaponFired from '../common/message/WeaponFired'
import followPath from './followPath'
import damagePlayer from './damagePlayer' // TODO
import niceInstanceExtension from './niceInstanceExtension'
import applyCommand from '../common/applyCommand'
import setupObstacles from './setupObstacles'
import { fire } from '../common/weapon'
import lagCompensatedHitscanCheck from './lagCompensatedHitscanCheck'

import * as BABYLON from 'babylonjs'
//import 'babylonjs-loaders' // mutates something globally
global.XMLHttpRequest = require('xhr2').XMLHttpRequest

class GameInstance {
	constructor() {
		const engine = new BABYLON.NullEngine()
		engine.enableOfflineSupport = false
		const scene = new BABYLON.Scene(engine)
		scene.collisionsEnabled = true
		//const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene)

		this.instance = new nengi.Instance(nengiConfig, { port: 8079 })
		niceInstanceExtension(this.instance)

		// game-related state
		this.obstacles = setupObstacles(this.instance)
		// (the rest is just attached to client objects when they connect)

		this.instance.on('connect', ({ client, callback }) => {
			// PER player-related state, attached to clients

			// create a entity for this client
			const rawEntity = new PlayerCharacter()
			rawEntity.mesh.checkCollisions = true

			// make the raw entity only visible to this client
			const channel = this.instance.createChannel()
			channel.subscribe(client)
			channel.addEntity(rawEntity)
			//this.instance.addEntity(rawEntity)
			client.channel = channel

			// smooth entity is visible to everyone
			const smoothEntity = new PlayerCharacter()
			smoothEntity.mesh.checkCollisions = false
			this.instance.addEntity(smoothEntity)

			// tell the client which entities it controls
			this.instance.message(new Identity(rawEntity.nid, smoothEntity.nid), client)

			// establish a relation between this entity and the client
			rawEntity.client = client
			client.rawEntity = rawEntity
			smoothEntity.client = client
			client.smoothEntity = smoothEntity
			client.positions = []

			// define the view (the area of the game visible to this client, all else is culled)
			// there is no 3D view culler in nengi yet, so we just use a big view (there will be one soon tho)
			client.view = {
				x: rawEntity.x,
				y: rawEntity.y,
				halfWidth: 99999,
				halfHeight: 99999
			}

			// accept the connection
			callback({ accepted: true, text: 'Welcome!' })
		})

		this.instance.on('disconnect', client => {
			// clean up per client state
			client.rawEntity.mesh.dispose()
			client.smoothEntity.mesh.dispose()
			this.instance.removeEntity(client.rawEntity)
			this.instance.removeEntity(client.smoothEntity)
			client.channel.destroy()
		})

		this.instance.on('command::MoveCommand', ({ command, client, tick }) => {
			// move this client's entity
			const entity = client.rawEntity

			applyCommand(entity, command, this.obstacles)
			client.positions.push({
				x: entity.x,
				y: entity.y,
				z: entity.z,
				rotation: entity.rotation
			})
		})

		this.instance.on('command::FireCommand', ({ command, client, tick }) => {
			// shoot from the perspective of this client's entity
			const entity = client.rawEntity
			const smoothEntity = client.smoothEntity

			const ray = fire(entity)
			if (ray) {
				const timeAgo = client.latency + 100
				const hits = lagCompensatedHitscanCheck(this.instance, ray, timeAgo)

				hits.forEach(victim => {
					// if the victim isn't ourself...
					if (victim.nid !== entity.nid && victim.nid !== smoothEntity.nid) {
						console.log('hit', victim.nid)

						if (victim instanceof PlayerCharacter) {
							console.log('you hit a player!')
						}
					}
				})

				// send a network message (causes all clients to draw the specified ray)
				// NOTE: we fire the shot from the RAW entity for accuracy that matches 
				// what the player experienced on their own screen. But for apperances, we 
				// tell everyone that the shot came from the smooth entity's position.
				this.instance.addLocalMessage(new WeaponFired(
					smoothEntity.nid,
					smoothEntity.x,
					smoothEntity.y,
					smoothEntity.z,
					ray.direction.x,
					ray.direction.y,
					ray.direction.z,
				))
			}
		})
	}

	update(delta, tick, now) {
		this.instance.emitCommands()

		// for each player ...
		this.instance.clients.forEach(client => {
			const { rawEntity, smoothEntity } = client

			// center client's network view on the entity they control
			client.view.x = rawEntity.x
			client.view.y = rawEntity.y

			// smooth entity will follow raw entity's path at *up to* 110% movement speed
			// confused? stop by the nengi discord server https://discord.gg/7kAa7NJ 
			const movementBudget = rawEntity.speed * 1.1 * delta
			followPath(smoothEntity, client.positions, movementBudget)
			smoothEntity.rotationX = rawEntity.rotationX
			smoothEntity.rotationY = rawEntity.rotationY
		})

		// TECHNICALLY we should call scene.render(), but as this game is so simple and
		// computeWorldMatrix is called on every object after it is moved, i skipped it.
		// that's all scene.render() was going to do for us

		// when instance.updates, nengi sends out snapshots to every client
		this.instance.update()
	}
}

export default GameInstance
