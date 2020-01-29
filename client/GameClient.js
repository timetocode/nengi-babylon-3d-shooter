import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import Simulator from './Simulator'
import niceClientExtension from './niceClientExtension'

class GameClient {
	constructor() {
		this.client = new nengi.Client(nengiConfig, 100)
		this.client.factory = {}
		niceClientExtension(this.client)// API EXTENSION
		this.simulator = new Simulator(this.client)

		this.client.on('connected', res => { console.log('onConnect response:', res) })
		this.client.on('disconnected', () => { console.log('connection closed') })

		const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
		const url = location.hostname === 'localhost' && location.port === "8080"
			? 'ws://localhost:8079'
			: `${proto}//${location.host}`

		console.log("Connecting to:", url)
		this.client.connect(url)
	}

	update(delta, tick, now) {
		this.client.readNetworkAndEmit()
		this.simulator.update(delta)
		this.client.update()
	}
}

export default GameClient
