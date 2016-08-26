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

	// rebuildnode(node){
	// 	if(node.children){
	// 		let newlist = node.children.map(child=>{
	// 			let newnode=extend({},child)
	// 			newnode.parent = node.uuid
	// 			if(newnode.type==='folder')newnode.children=[]
	// 			return newnode
	// 		})
	// 		return newlist
	// 	}
	// 	// console.log("ppp======ppppp")
	// 	// console.log(node.children)
	// 	// console.log(newnode.children)
	// 	return node.children
	// }

	// rebuildnode(node){
	// 	//let newnode=extend({},node)
	// 	console.log(node.children)
	// 	if(node.children){
	// 		let newlist=node.children.map(child=>{
	// 			child.parent = node.uuid
	// 			if(child.type==='folder')child.children=[]
	// 			return child
	// 		})
	// 		// console.log("-------")
	// 		// console.log(node.children)
	// 		// console.log(newchildren)
	// 		return newlist
	// 	}
	// 	else return []
	// 	//console.log("ppp======ppppp")
	// 	//console.log(node)
	// 	//console.log(newnode)
	// }

	canonicalJson(node){
		return Stringify(node)
	}

	calHash(node){
		return sha256(Stringify(node))
	}

	postSyncVisit(node) {
	    if(node.children)node.children.forEach(child => this.postSyncVisit(child))
	    if(node.type==="folder"){
	    	node.hash=""
	    	// console.log(node.name)
	    	// console.log(node.children)
	    	let newnode=this.serializeNode(node)
	    	//console.log("-------")
	    	//console.log(newnode)
	    	//console.log("-------")
	    	node.hash=this.createSyncFile(newnode.children,this.canonicalJson(newnode.children))
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

	createHashSet(set,node){
		if(node.type==='folder'){
			set.add(node.hash)
			node.children.map(child=>this.createHashSet(set,child))
			return set
		}
	}

	createHashMap(map,node){
		if(node.type==='folder'){
			map.set(node.hash,node)
			node.children.map(child=>this.createHashMap(map,child))
			return map
		}
	}

	checkUpdate(list,set,node){
		if(node.type==='folder'){
			node.children.map(child=>this.checkUpdate(list,set,node))
			let newnode=seriarlizeNode(node)
			node.hash=this.createSyncFile(newnode.children,this.canonicalJson(newnode.children))
			if(!set.has(node.hash)){
				list.push(newnode)
			}
			return list
		}
	}

	serializeNode(node){
		//console.log(node.name)
		let newnode=extend({},node)
		if(newnode.parent!==null)newnode.parent=newnode.parent.uuid
		newnode.children=newnode.children.map(child=>{
			let newchild = extend({},child)
			newchild.parent = node.uuid
			if(newchild.type==='folder')newchild.children=[]
			return newchild
		})
		return newnode
	}

	getLastestTree(map,node){
		if(node.type==='folder'){
			if(map.has(node.hash)){
				let newnode=map.get(nodehash)
				node.children.reduce((p,c)=>(c.uuid!==newnode.uuid)?p.push(c):p.push(newnode),[])
				node.children.map(child=>this.getLastestTree(map,child))
			}
		}
	}

	syncTree(jsonobjlist,node){
		let rootnode='';
		let newhashmap=this.createHashMap(new Map(),node)
		jsonobjlist.map(obj=>{
			newhashmap.set(obj.hash,obj)
			if(obj.parent===null)rootnode=obj
		})
		if(rootnode==='')throw new Error('cant find rootnode')
		return getLastestTree(newhashmap,rootnode)
	}

	diff(uuid){
		let newtree = this.restoreTreeFromFiles(uuid)
		let hashset = this.createHashSet(new Set(),newtree.root)
		let newlist = this.checkUpdate(new Array(),hashset,this.findNodeInDriveByUUID(uuid))
		return newlist
	}

}

function createSyncManager(rootp,callback){
	return callback(new syncManager(rootp))
}

export { createSyncManager }