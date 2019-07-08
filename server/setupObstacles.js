import Obstacle from '../common/entity/Obstacle'

// setup a few obstacles
export default (instance) => {

	const obstacles = new Map()

	const obsA = new Obstacle()
	obsA.x = 10
	
	instance.addEntity(obsA)
	obstacles.set(obsA.nid, obsA)

	obsA.mesh.computeWorldMatrix(true)

	const obsB = new Obstacle()
	obsB.x = 6
	obsB.z = 8

	instance.addEntity(obsB)
	obstacles.set(obsB.nid, obsB)

	obsB.mesh.computeWorldMatrix(true)

	return obstacles
}