import nengi from 'nengi'

class Identity {
    constructor(rawId, smoothId) {
        this.rawId = rawId
        this.smoothId = smoothId
    }
}

Identity.protocol = {
    rawId: nengi.UInt16,
    smoothId: nengi.UInt16
}

export default Identity
