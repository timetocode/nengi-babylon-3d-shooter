import nengi from 'nengi'

class WeaponFired {
    constructor(sourceId, x, y, z, tx, ty, tz) {
        this.sourceId = sourceId
        this.x = x
		this.y = y
		this.z = z
        this.tx = tx
		this.ty = ty
		this.tz = tz
    }
}

WeaponFired.protocol = {
    sourceId: nengi.UInt16,
    x: nengi.Float32,
	y: nengi.Float32,
	z: nengi.Float32,
    tx: nengi.Float32,
	ty: nengi.Float32,
	tz: nengi.Float32
}

export default WeaponFired
