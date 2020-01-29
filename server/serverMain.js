import GameInstance from './GameInstance';
import nengiConfig from '../common/nengiConfig';
import * as http from 'http';
import serveHandler from 'serve-handler'

const port = process.env.PORT || 8079
const httpServer = http.createServer((request, response) => {
    return serveHandler(request, response, {
        public: "public"
    })
})
  
httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const gameInstance = new GameInstance({ httpServer })

const hrtimeMs = function() {
    let time = process.hrtime()
    return time[0] * 1000 + time[1] / 1000000
}

let tick = 0
let previous = hrtimeMs()
const tickLengthMs = 1000 / nengiConfig.UPDATE_RATE

const loop = function() {
    const now = hrtimeMs()
    if (previous + tickLengthMs <= now) {
        const delta = (now - previous) / 1000
        previous = now
        tick++

        //let start = hrtimeMs() // uncomment to benchmark
        gameInstance.update(delta, tick, Date.now())
        //let stop = hrtimeMs()
        //console.log('game update took', stop-start, 'ms')
    }

    if (hrtimeMs() - previous < tickLengthMs - 4) {
        setTimeout(loop)
    } else {
        setImmediate(loop)
    }
}

loop()
