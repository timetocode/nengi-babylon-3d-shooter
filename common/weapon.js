/* weapon system */

import { Vector3, Ray } from 'babylonjs'

// advances the weapon cooldown timer
export const update = (entity, delta) => {
	const weapon = entity.weapon
	if (weapon.onCooldown) {
		weapon.acc += delta
		if (weapon.acc >= weapon.cooldown) {
			weapon.acc = 0
			weapon.onCooldown = false
		}
	}
}

// returns a ray if the entity is alive and the weapon is off cooldown, otherwise false
export const fire = (entity) => {
	if (entity.isAlive && !entity.weapon.onCooldown) {
		entity.weapon.onCooldown = true

		const wm = entity.mesh.getWorldMatrix()
		const aimVector = Vector3.TransformCoordinates(Vector3.Forward(), wm)
			.subtract(entity.mesh.position)
			.normalize() // kinda feel like I could've skipped some steps here

		return new Ray(entity.mesh.position, aimVector)
	}
	return false
}