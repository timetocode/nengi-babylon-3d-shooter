
// not used !!!
const damagePlayer = (victim, amount) => {
    //console.log('damage!', victim.nid, victim.isAlive, victim.hitpoints)
    if (victim.isAlive) {
        victim.hitpoints -= 25
        // copy damage to the rawEntity
        victim.client.rawEntity.hitpoints = victim.hitpoints
    }
    if (victim.hitpoints <= 0 && victim.isAlive) {
        //console.log('dead')
        victim.hitpoints = 0
        victim.isAlive = false

        // DEAD! come back to life and teleport to a new spot
        setTimeout(() => {
            victim.hitpoints = 100
            victim.isAlive = 100
            victim.x = Math.random() * 500
            victim.y = Math.random() * 500

            // teleport the raw entity too
            victim.client.rawEntity.x = victim.x
            victim.client.rawEntity.y = victim.y
            victim.client.rawEntity.hitpoints = 100
            victim.client.positions = []
        }, 1000)
    }
}

export default damagePlayer
