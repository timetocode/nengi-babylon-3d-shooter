export default (instance, ray, timeAgo) => {
	// note: there is no 3D lag compensation culler in nengi at the moment
	// so we just create an area that includes the whole game
	const area = { x: 0, y: 0, z: 0, halfWidth: 999999, halfHeight: 999999, halfDepth: 999999}

	const hits = []
	const pastEntities = instance.historian.getLagCompensatedArea(timeAgo, area)
	pastEntities.forEach(pastEntity => {
		// look up the real entity 
		// -- the objects returned by instance.historian are just shallow copies from the past
		const realEntity = instance.entities.get(pastEntity.nid)

		// real entity may not still exist. Just b/c it did in the past is no guarantee!
		if (realEntity) {
			// save position
			const temp = Object.assign({}, realEntity.mesh.position)

			// rewind to the lag compensated position
			realEntity.x = pastEntity.x
			realEntity.y = pastEntity.y
			realEntity.z = pastEntity.z
			realEntity.mesh.computeWorldMatrix(true)

			// see if the ray collides with an entity at the lag compensated position
			const raycheck = ray.intersectsMesh(realEntity.mesh)

			// restore the entity back to its current position (undo the lag compensated translation)
			Object.assign(realEntity.mesh.position, temp)

			if (raycheck.hit) {
				hits.push(realEntity)
			}
		}

	})
	return hits
}
