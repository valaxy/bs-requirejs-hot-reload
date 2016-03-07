;define(function () {


	class Graph {
		constructor() {

		}

		get(moduleName) {
			var result = []
			var mark = {}

			dfs({
				initial: moduleName,
				next   : function (file, push) {
					this._g.eachEdge(function (nothing, to) {
						if (!mark[to]) {
							push(to)
						}
					}, file)
				}.bind(this),
				enter  : function (x) {
					mark[x] = true
					result.push(x)
				}
			})

			return result.slice(1) // remove initial one
		}

		getDependencies(moduleName) {

		}

		getBeDependencies(moduleName) {

		}

		onAddFile(fileRelativePath, depends) {
			this._g.addNode(fileRelativePath) // depends may empty
			depends.forEach(function (depend) {
				this._g.addEdge(depend, fileRelativePath)
			}.bind(this))
		}

		onChangeFile(fileRelativePath, depends) {
			if (this._g.hasNode(fileRelativePath)) {
				this.onDeleteFile(fileRelativePath)
			}
			this.onAddFile(fileRelativePath, depends)
		}

		onDeleteFile(fileRelativePath) {
			this._g.removeEdge(undefined, fileRelativePath)
			if (!this._g.hasEdge(fileRelativePath)) {
				this._g.removeNode(fileRelativePath)
			}
		}
	}

	var g = new Graph

	requirejs.onResourceLoad = function (context, map, depArray) {

	};


	var updateModule = function (moduleName) {
		let beDependencies = g.getBeDependencies(moduleName)
		requirejs.undef(moduleName)
		require([moduleName], (newModuleRef) => {
			g.set(moduleName, newModuleRef)
			beDependencies.forEach(({ref}) => {
				ref.__updateModule()
			})
		})
	};

	(function (socket) {
		if (!socket) return

		const MODULE_UPDATE = 'module:update'

		socket.on(MODULE_UPDATE, function (data) {
			updateModule(data.moduleName)
		})


	})(window.___browserSync___.socket)
});