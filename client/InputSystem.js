const _pointerLock = element => {
	element.requestPointerLock = element.requestPointerLock ||
		element.mozRequestPointerLock ||
		element.webkitRequestPointerLock

	element.requestPointerLock()
}

// not used, because hitting escape does this within the browser (outside of javascript)
const _pointerUnlock = element => {
	element.exitPointerLock = element.exitPointerLock ||
		element.mozExitPointerLock ||
		element.webkitExitPointerLock

	element.exitPointerLock()
}

const keybinds = {
	// arrow keys
	38: 'forwards',
	37: 'left',
	40: 'down',
	39: 'right',

	87: 'forwards', // w
	65: 'left', // a
	83: 'backwards', // s
	68: 'right', // d
	32: 'jump', // spacebar
	82: 'reload' // r
}

const keystate = () => {
	return {
		forwards: false,
		backwards: false,
		left: false,
		right: false,
		jump: false,
		reload: false,
		mouseDown: false
	}
}

class InputSystem {
	constructor() {
		this.canvasEle = document.getElementById('main-canvas')
		this.onmousemove = null
		this.pointerLocked = false
		this._currentState = keystate()
		this.frameState = keystate()

		// disable right click context menu
		document.addEventListener('contextmenu', event =>
			event.preventDefault()
		)

		document.addEventListener('keydown', event => {
			if (!this.pointerLocked) { return }

			const action = keybinds[event.keyCode]
			if (action) {
				this._currentState[action] = true
				this.frameState[action] = true
			}
		})

		document.addEventListener('keyup', event => {

			const action = keybinds[event.keyCode]
			if (action) {
				this._currentState[action] = false
			}

			if (event.keyCode === 82) {
				if (this._currentState.r === true) {
					// used to implement reload on keyup instead of keydown
					this.frameState.justReleasedR = true
				}
				this._currentState.reload = false
			}
		})

		document.addEventListener('mousemove', event => {
			if (!this.pointerLocked) { return }

			if (this.onmousemove) {
				this.onmousemove(event)
			}
		})

		document.addEventListener('pointerdown', event => {
			if (!this.pointerLocked) {
				_pointerLock(this.canvasEle)
			}

			this._currentState.mouseDown = true
			this.frameState.mouseDown = true
		})

		document.addEventListener('pointerlockchange', () => {
			if (document.pointerLockElement === this.canvasEle) {
				console.log('pointer locked')
				this.pointerLocked = true
			} else {
				console.log('pointer unlocked')
				this.pointerLocked = false
			}
		})

		document.addEventListener('mouseup', event => {
			this._currentState.mouseDown = false
		})
	}

	releaseKeys() {
		this.frameState.forwards = this._currentState.forwards
		this.frameState.left = this._currentState.left
		this.frameState.backwards = this._currentState.backwards
		this.frameState.right = this._currentState.right
		this.frameState.reload = this._currentState.reload
		this.frameState.mouseDown = this._currentState.mouseDown
		this.frameState.jump = this._currentState.jump
		this.frameState.justReleasedR = false
	}
}

export default InputSystem
