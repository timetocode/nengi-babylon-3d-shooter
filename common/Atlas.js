import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'

const meshes = new Map()
const basePath = `http://localhost:8080/models`

const modelsToLoad = [
	'brain.obj',
	// etc
]

const queueModels = (assetsManager) => {
	modelsToLoad.forEach(filename => {
		const path = `${basePath}/`
		const name = `load ${filename}`
		const meshTask = assetsManager.addMeshTask(name, '', path, filename)

		meshTask.onSuccess = (task) => {
			const mesh = task.loadedMeshes[0]
			mesh.setEnabled(false)
			//mesh.material.freeze()
			meshes.set(filename, mesh)
		}
		meshTask.onError = (err) => {
			console.log('TASK ERROR', err)
		}
	})
}

const load = (scene, errback, successback) => {
	const assetsManager = new BABYLON.AssetsManager(scene)
	queueModels(assetsManager)

	let anyErrors = false
	assetsManager.onProgress = (remainingCount, totalCount, lastFinishedTask) => {
		// tie into progress events if you want them here
		//console.log('progress', remainingCount, totalCount)
	}
	assetsManager.onFinish = () => {
		if (!anyErrors) {
			successback()
		} else {
			errback()
		}
	}

	assetsManager.onTaskError = (task) => {
		anyErrors = true
		console.log('task error:', task.name)
	}
	assetsManager.load()
}

export default { meshes, load }
