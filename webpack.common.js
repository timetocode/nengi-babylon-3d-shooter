const path = require('path')

const version = '0.0.1'

module.exports = {
	entry: './client/clientMain.js',
	output: {
        path: path.resolve(__dirname, './public/js'),
		filename: 'app-v' + version + '.js'

	}
}
