export default (/* inject depenencies here */) => {
	return {
		create({ data, entity }) {
			// don't need to do anything really..
		},
		delete({ nid, entity }) {
			entity.mesh.dispose()
		}
	}
}
