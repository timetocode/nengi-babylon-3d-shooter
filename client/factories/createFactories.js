import createPlayerFactory from './createPlayerFactory'
import createObstacleFactory from './createObstacleFactory'

export default ({ simulator /* inject depenencies here */ }) => {
	return {
		'PlayerCharacter': createPlayerFactory({ simulator, /* inject depenencies here */ }),
		'Obstacle': createObstacleFactory(/* inject depenencies here */)
	}
}
