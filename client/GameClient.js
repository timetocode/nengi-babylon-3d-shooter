import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import Simulator from './Simulator'
import niceClientExtension from './niceClientExtension'


class GameClient {
	constructor() {
		this.client = new nengi.Client(nengiConfig, 100)
		niceClientExtension(this.client)// API EXTENSION
		this.simulator = new Simulator(this.client)
		this.client.on('connected', res => { console.log('onConnect response:', res) })
		this.client.on('disconnected', () => { console.log('connection closed') })
		this.client.connect('ws://localhost:8079')
	}

	update(delta, tick, now) {
		this.client.readNetworkAndEmit()
		this.simulator.update(delta)
		this.client.update()
	}
}

export default GameClient
