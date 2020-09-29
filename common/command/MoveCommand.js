import nengi from 'nengi'

class MoveCommand {
    constructor(props) {
		// lazy shorthand, see the protocol below to know what the props are
		Object.assign(this, props)
    }
}

// Example of CLIENT AUTHORITATIVE state, aka very hackable
MoveCommand.protocol = {
	x: nengi.Float32,
	y: nengi.Float32,
	z: nengi.Float32,
	camRayX: nengi.Float32,
	camRayY: nengi.Float32,
	camRayZ: nengi.Float32,
}

export default MoveCommand
