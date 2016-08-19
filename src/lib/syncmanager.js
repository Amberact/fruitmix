let Stringify= require('canonical-json');
let fs = require("fs")
let sha256 = require("sha256")
let path = require("path")
let extend = require('util')._extend;
import {buildanewtree,restoretree} from '../../src/lib/restoretree'

class syncManager {

	constructor(rootp){
		this.rootpath = rootp
		this.drives = []
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

	findNodeInDriveByUUID(uuid) {
	    for (let i = 0; i < this.drives.length; i++) {
	      let x = this.drives[i].uuidMap.get(uuid)
	      if (x) return x
	    }
	 }

	restoreTreeFromFiles(uuid){
		let newtree=buildanewtree(uuid)
		this.drives.push(newtree)
		return newtree
	}

	restoreTreeFromJson(jsonobj){
		let newtree=restoretree(jsonobj)
		this.drives.push(newtree)
		return newtree
	}

}

function createSyncManager(rootp,callback){
	return callback(new syncManager(rootp))
}

export { createSyncManager }