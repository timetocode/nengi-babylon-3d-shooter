export default (instance) => {

    instance.onConnect((client, data, callback) => {
        instance.emit('connect', { client, data, callback })
    })

    instance.onDisconnect(client => {
        instance.emit('disconnect', client)
    })

    instance.emitCommands = () => {
        let cmd = null
        while (cmd = instance.getNextCommand()) {
            const tick = cmd.tick
            const client = cmd.client

            for (let i = 0; i < cmd.commands.length; i++) {
                const command = cmd.commands[i]
                instance.emit(`command::${command.protocol.name}`, { command, client, tick })
            }
        }
    }
}