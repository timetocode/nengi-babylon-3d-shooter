import { update as updateWeapon } from './weapon'
import { Vector3 } from 'babylonjs'

export default (entity, command) => {
	if (!entity.isAlive) {
		return
	}
	// first person style movement (look in any direction, but move flatly in the x/z plane)
	const camVector = new Vector3(command.camRayX, command.camRayY, command.camRayZ)
	entity.mesh.lookAt(entity.mesh.position.add(camVector))

	// create an impulse from input, e.g. forwards, backwards, left, right; relative to self
	const impulse = BABYLON.Vector3.Zero()
	// horizontal movement
	if (command.forwards) { impulse.z += 1 }
	if (command.backwards) { impulse.z -= 1 }
	if (command.left) { impulse.x -= 1 }
	if (command.right) { impulse.x += 1 }
	// vertical movement (jump is just a jetpack to keep this code short and free of acceleration)
	if (command.jump) {
		// linearly move up
		impulse.y += 1
	} else {
		// very fake gravity while not using jetpack
		impulse.y -= 1
	}
	impulse.normalize()

	// rotate our impulse to a direction in world space
	const matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, entity.mesh.rotation.y)
	const direction = BABYLON.Vector3.TransformCoordinates(impulse, matrix)

	// translate (aka actual movement incase you want to see it without collisions)
	//entity.mesh.position.x += direction.x * entity.speed * command.delta
	//entity.mesh.position.y += direction.y * entity.speed * command.delta
	//entity.mesh.position.z += direction.z * entity.speed * command.delta

	entity.mesh.moveWithCollisions(new Vector3(
		direction.x * entity.speed * command.delta,
		direction.y * entity.speed * command.delta,
		direction.z * entity.speed * command.delta
	))

	// don't fall through the ground w/ our fake gravity
	if (entity.mesh.position.y < 0) {
		entity.mesh.position.y = 0
	}

	// advances the weapon-related timer(s)
	// probably doesnt belong here... the only thing it wanted to know was delta
	updateWeapon(entity, command.delta)
}