import playerHooks from './playerHooks'
import obstacleHooks from './obstacleHooks'

export default ({ simulator /* inject depenencies here */ }) => {
	return {
		'PlayerCharacter': playerHooks({ simulator, /* inject depenencies here */ }),
		'Obstacle': obstacleHooks(/* inject depenencies here */)
	}
}
