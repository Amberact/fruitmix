let Stringify= require('canonical-json');
let fs = require("fs")
let sha256 = require("sha256")
let path = require("path")
let extend = require('util')._extend;

class syncManager {

	constructor(rootp){
		this.rootpath = rootp
	}

	createSyncFile(node,str){
		let hash=this.calHash(node)
		let tmppath=path.join(this.rootpath,hash)
		try{
			fs.writeFileSync(tmppath,str)
			return hash
		}
		catch(e)
		{
			return e
		}
	}

	rebuildnode(node){
		let newnode=extend({},node)
		if(newnode.children){
			newnode.children.map(child=>{
				child.parent = node.uuid
				if(child.type==='folder')child.children=[]
			})
							
		}
		return newnode.children
	}

	canonicalJson(node){
		return Stringify(node)
	}

	calHash(node){
		return sha256(Stringify(node))
	}

	postSyncVisit(node) {
	    if (node.children)node.children.forEach(child => this.postSyncVisit(child))
	    if(node.type==="folder"){
	    	node.hash=""
	    	let newnode=this.rebuildnode(node)
	    	node.hash=this.createSyncFile(newnode,this.canonicalJson(newnode))
	    }
	}

}

function createSyncManager(rootp,callback){
	return callback(new syncManager(rootp))
}

export { createSyncManager }