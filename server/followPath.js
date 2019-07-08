// moves entity along path until out of movementBudget
// movementBudget is a distance of how far we can move in a single frame
const followPath = (entity, path, movementBudget) => {
    let budget = movementBudget 
    while (budget > 0 && path.length > 0) {
        const position = path[0]
        const dx = position.x - entity.x
		const dy = position.y - entity.y
		const dz = position.z - entity.z

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (budget >= dist) {
            budget -= dist
            Object.assign(entity, position)
            path.shift(position)
        } else if (budget < dist) {
            const ratio = budget / dist
            budget = 0
            entity.x += dx * ratio
			entity.y += dy * ratio
			entity.z += dz * ratio
            path.unshift(position)
        }
	}   
	entity.mesh.computeWorldMatrix(true)
}

export default followPath