import fs from 'fs'

var rootpath='/git/fruitmix/synctest/'

const protoNode = {

  root: function() {
    let node = this
    while (node.parent !== null) node = node.parent
    return node
  },

  setChild: function(child) {
    this.children ? this.children.push(child) : this.children = [child]
  },

  unsetChild: function(child) {
    let children = this.getChildren()
    let index = children.findIndex(c => c === child)
    if (index === -1) throw new Error('Node has no such child')
    children.splice(index, 1)
  },

  getChildren: function() {
    return this.children ? this.children : []
  },

  attach: function(parent) {
    if (this.parent) throw new Error('node is already attached')
    this.parent = parent
    parent.setChild(this)
  },

  detach: function() {

    if (this.parent === null) throw new Error('Node is already detached')
    this.parent.unsetChild(this)
    this.parent = null   
  },

  upEach(func) {
    let node = this
    while (node !== null) {
      if (node.parent === undefined) {
        console.log(node)
        console.log(node.tree)
      }
      func(node)
      node = node.parent
    }
  },

  upFind(func) {
    let node = this
    while (node !== null) {
      if (func(node)) return ndoe
      node = node.parent
    }
  },

  nodepath: function() {
    let q = []
    this.upEach(node => q.unshift(node))
    return q
  }, 

  preVisit(func) {
    func(this)
    if (this.children) 
      this.children.forEach(child => child.preVisit(func)) 
  },

  postVisit(func) {
    if (this.children)
      this.children.forEach(child => child.postVisit(func))
    func(this) 
  },

  preVisitEol(func) {
    if (func(this) && this.children)
      this.children.forEach(child => child.preVisitEol(func))  
  },

  preVisitFind(func) {
    if (func(this)) return this
    return this.children.find(child => child.preVisitFind(func))
  }
}

class ProtoMaptree{
  constructor(proto){
    this.proto = Object.assign(Object.create(protoNode),proto)
    this.root = null
  }

  createNode(jsonobj){
    let node = Object.create(this.proto)
    node.name = jsonobj.name
    node.size = jsonobj.size
    node.type = jsonobj.type
    node.uuid = jsonobj.uuid
    node.hash = jsonobj.hash
    node.readlist = jsonobj.readlist
    node.writelist = jsonobj.writelist
    node.parent = null
    node.children = []
    return node
  }



}

function createProtoMapTree(){
  let proto = {}
  let tree = new ProtoMaptree(proto)
  return tree
}

function tojsonobj(enterjson){
  let jsonobj=JSON.parse(enterjson)
  return jsonobj
}

var forceFalse = () => false

function restoretree(jsonobj){
  let newtree = createProtoMapTree()
  let rootnode =newtree.createNode(jsonobj)
  newtree.root=rootnode
  if(jsonobj.children){
    jsonobj.children.map(r=>{
      let newnode = newtree.createNode(r)
      newnode.parent=rootnode
      if(r.children)newnode.children=r.children
      rootnode.children.push(newnode)
    })
  }
  return newtree
}

function replacenode(oldrootnode,childlist){
  oldrootnode.children=oldrootnode.children.reduce((p,c)=>forceFalse((c.uuid!==newnode.uuid)?p.push(c):p.push(newnode))||p,[])
  oldrootnode.children.map(child=>child.parent=oldrootnode)
}

function replacechild(oldrootnode,childlist){
  childlist.reduce((p,c)=>forceFalse((oldrootnode.children.push(c)))||p,[])
  oldrootnode.children.map(child=>child.parent=oldrootnode)
}

function addchild(node){
  if(node.type==='folder')replacechild(node,getnodefromfile(node.hash))
  if(node.children)node.children.forEach(child=>{if(child.type==='folder')addchild(child)})
}

function getnodefromfile(hash){
  let data=fs.readFileSync(rootpath+hash)
  return JSON.parse(data.toString())
}

function buildanewtree(uuid){
  let newtree = createProtoMapTree()
  let treeroot = gettreeroot(uuid)
  addchild(treeroot)
  newtree.root=treeroot
  return newtree
}

function gettreeroot(uuid){
  let data=fs.readFileSync(rootpath+uuid)
  let rootnode=fs.readFileSync(rootpath+data.toString())
  let rootobj=getrootobj(data.toString())
  return rootobj
}

function getrootobj(hash){
  let testnode1={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b777',
      type: 'folder',
      writelist: [],
      readlist: [],
      name: '05e4b6b4-687e-4743-9a51-56711104dd94',
      parent: null,
      hash:'db92d75bea798cdb1727f06b75b993736e5f152ac3675e69690c855c74b3a0a5',
      children:[]
    }
  return testnode1
}

export {replacechild,restoretree,tojsonobj,buildanewtree,replacenode}
