# nengi + Babylon 3D shooter template
A template game for multiplayer 3D shooters made in Babylon.js + nengi.js

## Running the demo
```
npm install 
npm start
```
Then visit http://localhost:8080

You may want to open two browser windows.

Walkthrough video: [https://www.youtube.com/watch?v=oK15K9hTeCA](https://www.youtube.com/watch?v=oK15K9hTeCA) (only covers the client-side prediction and lag comp features, for basic nengi usage see the manual)

## Features
* streamlined api for creating entities on the client -- Use `create`, `delete` and `watch` (see: factories) to react on the client to entity changes if needed. Movement and rotation don't require any code, and just work as is.
* movement is predicted on client, and includes simple collisions with two demo obstacles via `moveWithCollisions`
* shots are rewind lag-compensated, but no damage occurs - server just logs hits to console
* babylon rayhelper shows shots (though ray is skinny and hard to see from from first person, needs replaced with something bigger -- easier to see with two players in the game)
* demonstrates a deterministic cooldown/timer (player shooting speed is controlled by cooldown, in a way that stays synced with the server)
* *server authoritative* - no shots and no movement is ever transfered from client to server -- only commands like move in a direction or shoot (server calculates the actual position moved to, or the ray produced by trying to shoot)
* deterministic keybinds/input
* reconciliation of movement prediction errors
* has a two-entity model consisting of `rawEntity` and `smoothEntity`which probably warrants a lot more explanation that this readme.

If you have questions come stop by the [nengi discord server](https://discord.gg/7kAa7NJ).

These are all advanced network programming features, and I don't recommend starting with a client-side predicted game if this is your first time using nengi. My recommendation for getting started with nengi is to read the [nengi.js manual](https://timetocode.com/nengi). Then to find one of the non-prediction centric game templates (they have 'basic' in the repo name) and add a small feature to them.

## Is this game template *done*?
Yes and no. It has an *okayish* structure, and shows all the hard stuff.  One could certainly clone it, delete `.git`, and start a fresh project with this as the base. That said, this repo is but one of many in a gradual trend of presenting nengi more and more integrated with other software, and also more and more biased to a specific game genre. It is my intent that eventually there will be dozens of fairly decent starting points (FPS, 2D shooter, 3D MMORPG, 2D tile-based rpg, platformer, etc.). In that sense, is this the definitive babylon 3d first person shooter template? For now yes, but it is likely to be extended in the future.

The fundamental areas most likely to change (ignoring the game polish, which is basicaly non-existent):
* not in love with the two-entity model... it accomplishes a very hard thing (conceals packetloss and cpu lag spikes in one client from affecting other players) but it is naturally complicated to code around. Two states? For something we think of as a single object? I think a wrapper that just handles it would be nice.
* There will eventually be a deterministic input library -- similar to the stub that exists in this game, but extend for different keybinds and different types of actions (press and hold, single press, etc)
* `moveWithCollisions` will not scale to many dozens of players or thousands of entities or giant world meshes, so another form of collisions needs implemented eventually
* there's no physics, but many requests to show a networked physics simulation staying in sync between client prediction and the main server. I do not have enough experience with ammo/oimo to say whether they can be used in this manner yet.
* would like to show how to load assets on both server and client (especially something large like terrain)
* there's a nengi 3d view culler in the works
* documentation for each feature
* the bots that typtically come with nengi projects are not yet operational in this one


