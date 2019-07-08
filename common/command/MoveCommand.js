import nengi from 'nengi'

class MoveCommand {
    constructor(props) {
		// lazy shorthand, see the protocol below to know what the props are
		Object.assign(this, props)
    }
}

MoveCommand.protocol = {
    forwards: nengi.Boolean,
    left: nengi.Boolean,
    backwards: nengi.Boolean,
	right: nengi.Boolean,
	jump: nengi.Boolean,
	camRayX: nengi.Float32,
	camRayY: nengi.Float32,
	camRayZ: nengi.Float32,
    delta: nengi.Float32
}

export default MoveCommand
