
var extend = require('util')._extend;

let testnode2={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b3bf',
  type: 'folder',
  writelist: [],
  readlist: [],
  name: '05e4b6b4-687e-4743-9a51-56711104dd94',
  parent: null,
  children: 
   [{uuid: 'fa3f6a95-c1c9-4412-82a1-a80948bd2765',
      type: 'file',
      name: 'bcb',
      size: 2,
      parent: '8c594bb5-19b3-45c4-bb30-c894e176b3bf'},{
      uuid: 'fa3f6a95-c1c9-4412-82a1-a80948bd2765',
      type: 'file',
      name: 'bcb',
      size: 2,
      parent: null}
      ]
  }



function rebuildnode(node){
		let newnode=extend({},node)
		newnode.children.map(child=>{
			child.parent = node.uuid
		})
		return newnode
	}

console.log(rebuildnode(testnode2))