import nengi from 'nengi'
import PlayerCharacter from './entity/PlayerCharacter'
import Identity from './message/Identity'
import WeaponFired from './message/WeaponFired'
import MoveCommand from './command/MoveCommand'
import FireCommand from './command/FireCommand'
import Obstacle from './entity/Obstacle'

const config = {
    UPDATE_RATE: 20, 

    ID_BINARY_TYPE: nengi.UInt16,
    TYPE_BINARY_TYPE: nengi.UInt8, 

    ID_PROPERTY_NAME: 'nid',
    TYPE_PROPERTY_NAME: 'ntype', 

    USE_HISTORIAN: true,
    HISTORIAN_TICKS: 40,

    DIMENSIONALITY: 3,

    protocols: {
        entities: [
            ['PlayerCharacter', PlayerCharacter],
            ['Obstacle', Obstacle]
        ],
        localMessages: [],
        messages: [
            ['Identity', Identity],
            ['WeaponFired', WeaponFired]
        ],
        commands: [
            ['MoveCommand', MoveCommand],
            ['FireCommand', FireCommand]
        ],
        basics: []
    }
}

export default config