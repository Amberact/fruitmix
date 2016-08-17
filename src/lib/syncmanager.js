let Stringify= require('canonical-json');
let fs = require("fs")
let sha256 = require("sha256")
let path = require("path")
let extend = require('util')._extend;
//let rootpath = ""
// class syncManager{
// 	constructor(){
// 		this.drives=[]
// 		this.libraries=[]
// 	}
//var path = require('path');
// 	createDriveSync(){
//var node1={a:1,c:2,b:3}	
// 	}

// 	createLibrarySync(uuid,parentname,childname){

// 	}

// 	findCheckpointInLibrarySync(hash){
// 		for(let i=0; i<libraries.length;i++){
// 			let x=libraries[i].uuidMap.get(hash)
// 			if(x) return x
// 		}
// 	}

// 	checkLibrarySync(hash,parentname,childname){
// 		let checkpoint = findCheckpointInLibrarySync(hash)
// 		if(!checkpoint) return new Error('hash not found')
// 	}
// }

class syncManager {

	constructor(rootp){
		this.rootpath = rootp
	}

	// createSyncFileAsync(node,str,callback){
	// 	let tmppath=path.join(this.rootpath,node.hash)
	// 	fs.writeFile(tmppath,str,(err)=>{
	// 		if(err)return callback(err)
	// 		return callback(tmppath)
	// 	})
	// }

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
		// console.log(typeof(node))
		// let test=Stringify(node)
		// console.log(typeof(test))
		return Stringify(node)
	}

	calHash(node){
		return sha256(Stringify(node))
	}
	//canonicalJson(node1)

	postSyncVisit(node) {
	    if (node.children)node.children.forEach(child => this.postSyncVisit(child))
	    if(node.type==="folder"){
	    	node.hash=""
	    	// createSyncFileAsync(node,(r)=>{
	    	// })
	    	let newnode=this.rebuildnode(node)
	    	node.hash=this.createSyncFile(newnode,this.canonicalJson(newnode))

	    	//console.log(node.hash)
	    }
	}

}

function createSyncManager(rootp,callback){
	return callback(new syncManager(rootp))
}

export { createSyncManager }