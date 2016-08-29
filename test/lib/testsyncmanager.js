import path from 'path'
import fs from 'fs'

import rimraf from 'rimraf'
import mkdirp from 'mkdirp'
import xattr from 'fs-xattr'
import { expect } from 'chai'
import { replacenode ,restoretree,tojsonobj} from '../../src/lib/restoretree'
import { createSyncManager } from '../../src/lib/syncmanager'

describe('syncmanager', function() {

  describe('create syncmanager', function() {

    let rootpath = path.join(process.cwd(), 'synctest') 
    it('should create a new syncmanager', function(done) {
      
      rimraf('synctest', err => {
        if (err) return done(err)
        mkdirp('synctest', err => {
          if (err) return done(err) 
          createSyncManager(rootpath, (syncm) => {
            expect(syncm.rootpath).to.equal(rootpath)
            done()
          })
        })
      }) 
    })
  })

  describe('canonicalJson', function() {
    let testnode={a:1,c:2,b:3}
    let rootpath = path.join(process.cwd(), 'synctest') 
    it('should return a canonicalJson', function(done) {
      
      rimraf('synctest', err => {
        if (err) return done(err)
        mkdirp('synctest', err => {
          if (err) return done(err) 
          createSyncManager(rootpath, (syncm) => {
            expect(syncm.rootpath).to.equal(rootpath)
            let newnode=syncm.canonicalJson(testnode)
            expect(newnode).deep.to.equal('{"a":1,"b":3,"c":2}')
            done()
          })
        })
      }) 
    })
  })

  describe('hash', function() {
    let testnode={a:1,c:2,b:3}
    let rootpath = path.join(process.cwd(), 'synctest') 
    it('should return a hash value', function(done) {
      
      rimraf('synctest', err => {
        if (err) return done(err)
        mkdirp('synctest', err => {
          if (err) return done(err) 
          createSyncManager(rootpath, (syncm) => {
            expect(syncm.rootpath).to.equal(rootpath)
            let hash=syncm.calHash(testnode)
            expect(hash).deep.to.equal('9abf0853a542d602f7b461fa34f52ee42862d22c43552b76d115c53d230a0271')
            done()
          })
        })
      }) 
    })
  })

  describe('serializenode', function() {
    let testnode={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b3bf',
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
      parent: null},{
      uuid: 'fa3f6a95-c1c9-4412-82a1-a80948bd2765',
      type: 'file',
      name: 'bcb',
      size: 2,
      parent: null}
      ]
  }
    let rootpath = path.join(process.cwd(), 'synctest') 
    it('should return a serialized node', function(done) {
      
      rimraf('synctest', err => {
        if (err) return done(err)
        mkdirp('synctest', err => {
          if (err) return done(err) 
          createSyncManager(rootpath, (syncm) => {
            expect(syncm.rootpath).to.equal(rootpath)
            let newnode=syncm.serializeNode(testnode)
            expect(newnode.children).deep.to.equal(
               [{uuid: 'fa3f6a95-c1c9-4412-82a1-a80948bd2765',
                  type: 'file',
                  name: 'bcb',
                  size: 2,
                  parent: '8c594bb5-19b3-45c4-bb30-c894e176b3bf'},{
                  uuid: 'fa3f6a95-c1c9-4412-82a1-a80948bd2765',
                  type: 'file',
                  name: 'bcb',
                  size: 2,
                  parent: '8c594bb5-19b3-45c4-bb30-c894e176b3bf'}
                  ]
              )
            done()
          })
        })
      }) 
    })
  })

  describe('createsyncfile  v1', function() {
    let testnode={a:1,c:2,b:3,hash:'9abf0853a542d602f7b461fa34f52ee42862d22c43552b76d115c53d230a0271'}
    let rootpath = path.join(process.cwd(), 'synctest') 
    it('should create a sync file', function(done) {
      
      rimraf('synctest', err => {
        if (err) return done(err)
        mkdirp('synctest', err => {
          if (err) return done(err) 
          createSyncManager(rootpath, (syncm) => {
            expect(syncm.rootpath).to.equal(rootpath)
            let re=syncm.createSyncFile(testnode,"126576dasuidhb21")
            expect(re).deep.to.equal("a9822e9dbd1812fa0ac31eb525dd1cc46c70f32f32b0027d3f357a45444f1844")
            done()
          })
        })
      }) 
    })
  })

  describe('postSyncVisit  v1', function() {
    let testnode={a:1,c:2,b:3,hash:'9abf0853a542d602f7b461fa34f52ee42862d22c43552b76d115c53d230a0271',type:"folder"}
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
          parent: '8c594bb5-19b3-45c4-bb30-c894e176b3bf'}
          ]
    }

    let rootpath = path.join(process.cwd(), 'synctest') 
    it('should create a sync file', function(done) {
      
      rimraf('synctest', err => {
        if (err) return done(err)
        mkdirp('synctest', err => {
          if (err) return done(err) 
          createSyncManager(rootpath, (syncm) => {
            expect(syncm.rootpath).to.equal(rootpath)
            syncm.postSyncVisit(testnode2)
            let cjson=fs.readFileSync(rootpath+"/f79b089390904f5df40a5f1e8010167a97949f783674dd696e8ed068a1472b25")
            expect(cjson.toString()).deep.to.equal('[{"name":"bcb","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2765"},{"name":"bcb","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2765"}]')
            done()
          })
        })
      }) 
    })
  })

  describe('postSyncVisit  v2', function() {
    let testnode={a:1,c:2,b:3,hash:'9abf0853a542d602f7b461fa34f52ee42862d22c43552b76d115c53d230a0271',type:"folder"}
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
      parent: '8c594bb5-19b3-45c4-bb30-c894e176b3bf'}
      ]
    }


    let rootpath = path.join(process.cwd(), 'synctest') 
    it('should create a sync file', function(done) {
      
      rimraf('synctest', err => {
        if (err) return done(err)
        mkdirp('synctest', err => {
          if (err) return done(err) 
          createSyncManager(rootpath, (syncm) => {
            expect(syncm.rootpath).to.equal(rootpath)
            syncm.postSyncVisit(testnode2)
            let cjson=fs.readFileSync(rootpath+"/f79b089390904f5df40a5f1e8010167a97949f783674dd696e8ed068a1472b25")
            expect(cjson.toString()).deep.to.equal('[{"name":"bcb","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2765"},{"name":"bcb","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2765"}]')

            done()
          })
        })
      }) 
    })
  })

  describe('postSyncVisit  v3', function() {
    let testnode={a:1,c:2,b:3,hash:'9abf0853a542d602f7b461fa34f52ee42862d22c43552b76d115c53d230a0271',type:"folder"}
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
          parent: null},{
          uuid: 'fa3f6a95-c1c9-4412-82a1-a80948bd2567',
          type: 'file',
          name: 'abc',
          size: 2,
          parent: null}
          ]
        }


    let rootpath = path.join(process.cwd(), 'synctest') 
    it('should create a sync file', function(done) {
      
      rimraf('synctest', err => {
        if (err) return done(err)
        mkdirp('synctest', err => {
          if (err) return done(err) 
          createSyncManager(rootpath, (syncm) => {
            expect(syncm.rootpath).to.equal(rootpath)
            syncm.postSyncVisit(testnode2)
            let cjson=fs.readFileSync(rootpath+"/f316059d8ec90e0af3ec84322fa93956f36e23dfa83d9558af571ea55790a9c8")
            expect(cjson.toString()).deep.to.equal('[{"name":"bcb","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2765"},{"name":"abc","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2567"}]')
            
            let jsonobj = tojsonobj(cjson.toString())
            expect(jsonobj[0].name).to.equal('bcb')
            expect(jsonobj[0].parent).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b3bf')
            expect(jsonobj[0].size).to.equal(2)
            expect(jsonobj[0].type).to.equal('file')
            expect(jsonobj[0].uuid).to.equal('fa3f6a95-c1c9-4412-82a1-a80948bd2765')
            expect(jsonobj[1].name).to.equal('abc')
            expect(jsonobj[1].parent).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b3bf')
            expect(jsonobj[1].size).to.equal(2)
            expect(jsonobj[1].type).to.equal('file')
            expect(jsonobj[1].uuid).to.equal('fa3f6a95-c1c9-4412-82a1-a80948bd2567')
            syncm.postSyncVisit(testnode2)
            let sjson=fs.readFileSync(rootpath+"/f316059d8ec90e0af3ec84322fa93956f36e23dfa83d9558af571ea55790a9c8")
            expect(sjson.toString()).deep.to.equal('[{"name":"bcb","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2765"},{"name":"abc","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2567"}]')
            done()
          })
        })
      }) 
    })
  })

  describe('postSyncVisit  v4', function() {
    let testnode6={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b222',
      type: 'file',
      writelist: [],
      readlist: [],
      name: 'bbb.txt',
      parent: null,
      hash:11111,
      children:[]
        }

    let testnode5={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b333',
      type: 'file',
      writelist: [],
      readlist: [],
      name: 'ccc.txt',
      parent: null,
      hash:22222,
      children:[]
      }

    let testnode7={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b111',
      type: 'folder',
      writelist: [],
      readlist: [],
      name: 'aaa',
      parent: null,
      children:[testnode5,testnode6]
      }

    let testnode4={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b444',
      type: 'folder',
      writelist: [],
      readlist: [],
      name: 'ddd',
      parent: null,
      children:[testnode7]
      }

    let testnode3={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b555',
      type: 'file',
      writelist: [],
      readlist: [],
      name: 'eee.txt',
      parent: testnode4,
      hash:33333,
      children:[]
      }

    let testnode2={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b666',
      type: 'file',
      writelist: [],
      readlist: [],
      name: 'fff.txt',
      parent: testnode4,
      hash:44444,
      children:[]
      }

    let testnode1={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b777',
      type: 'folder',
      writelist: [],
      readlist: [],
      name: '05e4b6b4-687e-4743-9a51-56711104dd94',
      parent: null,
      children:[testnode4]
    }

    testnode7.parent=testnode4
    testnode6.parent=testnode7
    testnode5.parent=testnode7
    testnode4.children.push(testnode3)
    testnode4.children.push(testnode2)
    testnode4.parent=testnode1

    let rootpath = path.join(process.cwd(), 'synctest') 
    it('should create some sync files', function(done) {
      rimraf('synctest', err => {
        if (err) return done(err)
        mkdirp('synctest', err => {
          if (err) return done(err) 
          createSyncManager(rootpath, (syncm) => {
            expect(syncm.rootpath).to.equal(rootpath)
            syncm.postSyncVisit(testnode1)
            //let cjson=fs.readFileSync(rootpath+"/f316059d8ec90e0af3ec84322fa93956f36e23dfa83d9558af571ea55790a9c8")
            //expect(cjson.toString()).deep.to.equal('[{"name":"bcb","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2765"},{"name":"abc","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2567"}]')
            //---------------not finished
            done()
          })
        })
      }) 
    })
  })
  
  describe('restoretreefromfiles', function() {
    let testnode6={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b222',
      type: 'file',
      writelist: [],
      readlist: [],
      name: 'bbb.txt',
      parent: null,
      hash:11111,
      children:[]
        }

    let testnode5={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b333',
      type: 'file',
      writelist: [],
      readlist: [],
      name: 'ccc.txt',
      parent: null,
      hash:22222,
      children:[]
      }

    let testnode7={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b111',
      type: 'folder',
      writelist: [],
      readlist: [],
      name: 'aaa',
      parent: null,
      children:[testnode5,testnode6]
      }

    let testnode4={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b444',
      type: 'folder',
      writelist: [],
      readlist: [],
      name: 'ddd',
      parent: null,
      children:[testnode7]
      }

    let testnode3={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b555',
      type: 'file',
      writelist: [],
      readlist: [],
      name: 'eee.txt',
      parent: testnode4,
      hash:33333,
      children:[]
      }

    let testnode2={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b666',
      type: 'file',
      writelist: [],
      readlist: [],
      name: 'fff.txt',
      parent: testnode4,
      hash:44444,
      children:[]
      }

    let testnode1={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b777',
      type: 'folder',
      writelist: [],
      readlist: [],
      name: '05e4b6b4-687e-4743-9a51-56711104dd94',
      parent: null,
      children:[testnode4]
    }

    testnode7.parent=testnode4
    testnode6.parent=testnode7
    testnode5.parent=testnode7
    testnode4.children.push(testnode3)
    testnode4.children.push(testnode2)
    testnode4.parent=testnode1

    let rootpath = path.join(process.cwd(), 'synctest') 
    it('should restore a tree from filess', function(done) {
      rimraf('synctest', err => {
        if (err) return done(err)
        mkdirp('synctest', err => {
          if (err) return done(err) 
          createSyncManager(rootpath, (syncm) => {
            expect(syncm.rootpath).to.equal(rootpath)
            syncm.postSyncVisit(testnode1)
            fs.writeFileSync("/git/fruitmix/synctest/1234","db92d75bea798cdb1727f06b75b993736e5f152ac3675e69690c855c74b3a0a5")
            let tree=syncm.restoreTreeFromFiles('1234')
            console.log('--------')
            console.log(tree)
            expect(tree.root.type).to.equal('folder')
            expect(tree.root.name).to.equal('05e4b6b4-687e-4743-9a51-56711104dd94')
            expect(tree.root.uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b777')
            expect(tree.root.writelist).deep.to.equal([])
            expect(tree.root.readlist).deep.to.equal([])
            expect(tree.root.hash).to.equal('db92d75bea798cdb1727f06b75b993736e5f152ac3675e69690c855c74b3a0a5')
            expect(tree.root.children.length).to.equal(1)
            expect(tree.root.children[0].hash).to.equal('874c1bc8f9d913ea749a2a77e8c6a77dabe2fd572722b8e18b58acc0c8a163bc')
            expect(tree.root.children[0].name).to.equal('ddd')
            expect(tree.root.children[0].type).to.equal('folder')
            expect(tree.root.children[0].writelist).deep.to.equal([])
            expect(tree.root.children[0].readlist).deep.to.equal([])
            expect(tree.root.children[0].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b444')
            expect(tree.root.children[0].parent).to.equal(tree.root)
            expect(tree.root.children[0].children.length).to.equal(3)
            expect(tree.root.children[0].children[0].hash).to.equal('61f07e51ab6a1b3fde2d48c02a2debc399fd7ca2e280631fd50546eb5f116a4d')
            expect(tree.root.children[0].children[0].writelist).deep.to.equal([])
            expect(tree.root.children[0].children[0].readlist).deep.to.equal([])
            expect(tree.root.children[0].children[0].type).to.equal('folder')
            expect(tree.root.children[0].children[0].name).to.equal('aaa')
            expect(tree.root.children[0].children[0].parent).to.equal(tree.root.children[0])
            expect(tree.root.children[0].children[0].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b111')
            expect(tree.root.children[0].children[0].children.length).to.equal(2)
            expect(tree.root.children[0].children[1].hash).to.equal(33333)
            expect(tree.root.children[0].children[1].writelist).deep.to.equal([])
            expect(tree.root.children[0].children[1].readlist).deep.to.equal([])
            expect(tree.root.children[0].children[1].type).to.equal('file')
            expect(tree.root.children[0].children[1].name).to.equal('eee.txt')
            expect(tree.root.children[0].children[1].parent).to.equal(tree.root.children[0])
            expect(tree.root.children[0].children[1].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b555')
            expect(tree.root.children[0].children[1].children.length).to.equal(0)
            expect(tree.root.children[0].children[2].hash).to.equal(44444)
            expect(tree.root.children[0].children[2].writelist).deep.to.equal([])
            expect(tree.root.children[0].children[2].readlist).deep.to.equal([])
            expect(tree.root.children[0].children[2].type).to.equal('file')
            expect(tree.root.children[0].children[2].name).to.equal('fff.txt')
            expect(tree.root.children[0].children[2].parent).to.equal(tree.root.children[0])
            expect(tree.root.children[0].children[2].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b666')
            expect(tree.root.children[0].children[2].children.length).to.equal(0)
            expect(tree.root.children[0].children[0].children[0].hash).to.equal(22222)
            expect(tree.root.children[0].children[0].children[0].writelist).deep.to.equal([])
            expect(tree.root.children[0].children[0].children[0].readlist).deep.to.equal([])
            expect(tree.root.children[0].children[0].children[0].type).to.equal('file')
            expect(tree.root.children[0].children[0].children[0].name).to.equal('ccc.txt')
            expect(tree.root.children[0].children[0].children[0].parent).to.equal(tree.root.children[0].children[0])
            expect(tree.root.children[0].children[0].children[0].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b333')
            expect(tree.root.children[0].children[0].children[0].children.length).to.equal(0)
            expect(tree.root.children[0].children[0].children[1].hash).to.equal(11111)
            expect(tree.root.children[0].children[0].children[1].writelist).deep.to.equal([])
            expect(tree.root.children[0].children[0].children[1].readlist).deep.to.equal([])
            expect(tree.root.children[0].children[0].children[1].type).to.equal('file')
            expect(tree.root.children[0].children[0].children[1].name).to.equal('bbb.txt')
            expect(tree.root.children[0].children[0].children[1].parent).to.equal(tree.root.children[0].children[0])
            expect(tree.root.children[0].children[0].children[1].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b222')
            expect(tree.root.children[0].children[0].children[1].children.length).to.equal(0)
            done()
          })
        })
      }) 
    })
  })

  // describe('diff', function() {
  //   let testnode={a:1,c:2,b:3}
  //   let rootpath = path.join(process.cwd(), 'synctest') 
  //   it('should ', function(done) {    
  //     createSyncManager(rootpath, (syncm) => {
  //       expect(syncm.rootpath).to.equal(rootpath)
  //       let newnode=syncm.diff('1234')

  //       done()
  //     })
  //   })
  // })

  describe('serializenode', function() {
    let testnode1={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b777',
      type: 'folder',
      writelist: [],
      readlist: [],
      name: '05e4b6b4-687e-4743-9a51-56711104dd94',
      parent: null,
      children:[]
    }
    let testnode2={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b666',
      type: 'folder',
      writelist: [],
      readlist: [],
      name: 'fff.txt',
      parent: testnode1,
      hash:44444,
      children:[111]
    }

    testnode1.children.push(testnode2)

    let rootpath = path.join(process.cwd(), 'synctest') 
    it('should ', function(done) {    
      createSyncManager(rootpath, (syncm) => {
        expect(syncm.rootpath).to.equal(rootpath)
        let newnode=syncm.serializeNode(testnode1)
        expect(newnode.parent).to.equal(null)
        expect(newnode.children.length).to.equal(1)
        expect(newnode.children[0].parent).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b777')
        expect(newnode.children[0].children).deep.to.equal([])
        done()
      })
    })
  })

  // describe('synctree', function() {
  //   let testnode={parent:'98765'}
  //   let rootpath = path.join(process.cwd(), 'synctest') 
  //   it('should ', function(done) {    
  //     createSyncManager(rootpath, (syncm) => {
  //       expect(syncm.rootpath).to.equal(rootpath)
  //       let newnode=syncm.synctree(testnode)
        
  //       done()
  //     })
  //   })
  // })

  // describe('checkupdata', function() {
  //   let testnode={parent:'98765'}
  //   let rootpath = path.join(process.cwd(), 'synctest') 
  //   it('should ', function(done) {    
  //     createSyncManager(rootpath, (syncm) => {
  //       expect(syncm.rootpath).to.equal(rootpath)
  //       let newnode=syncm.synctree(testnode)
        
  //       done()
  //     })
  //   })
  // })

  describe('restoretreefromjson', function() {
    let testnode6={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b222',
      type: 'file',
      writelist: [],
      readlist: [],
      name: 'bbb.txt',
      parent: null,
      hash:11111,
      size:6,
      mtime:6,
      children:[]
        }

    let testnode5={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b333',
      type: 'file',
      writelist: [],
      readlist: [],
      name: 'ccc.txt',
      parent: null,
      hash:22222,
      size:5,
      mtime:5,
      children:[]
      }

    let testnode7={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b111',
      type: 'folder',
      writelist: [],
      readlist: [],
      name: 'aaa',
      parent: null,
      size:7,
      mtime:7,
      children:[testnode5,testnode6]
      }

    let testnode4={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b444',
      type: 'folder',
      writelist: [],
      readlist: [],
      name: 'ddd',
      parent: null,
      size:4,
      mtime:4,
      children:[testnode7]
      }

    let testnode3={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b555',
      type: 'file',
      writelist: [],
      readlist: [],
      name: 'eee.txt',
      parent: testnode4,
      hash:33333,
      size:3,
      mtime:3,
      children:[]
      }

    let testnode2={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b666',
      type: 'file',
      writelist: [],
      readlist: [],
      name: 'fff.txt',
      parent: testnode4,
      hash:44444,
      size:2,
      mtime:2,
      children:[]
      }

    let testnode1={ uuid: '8c594bb5-19b3-45c4-bb30-c894e176b777',
      type: 'folder',
      writelist: [],
      readlist: [],
      name: '05e4b6b4-687e-4743-9a51-56711104dd94',
      parent: null,
      size:1,
      mtime:1,
      children:[testnode4]
    }

    testnode6.parent=testnode7
    testnode5.parent=testnode7
    testnode4.children.push(testnode3)
    testnode4.children.push(testnode2)
    testnode4.parent=testnode1
    testnode7.parent=testnode4
    // console.log(">>>>>>>>>>")
    // console.log(testnode1)
    // console.log("--------")
    // console.log(testnode1.children[0])
    // console.log("<<<<<<<<<<")
            

    let rootpath = path.join(process.cwd(), 'synctest') 
    it('should restore a tree from json', function(done) {
      rimraf('synctest', err => {
        if (err) return done(err)
        mkdirp('synctest', err => {
          if (err) return done(err) 
          createSyncManager(rootpath, (syncm) => {
            expect(syncm.rootpath).to.equal(rootpath)
            // console.log("<<<<<<<<<<")
            // console.log(testnode1.children[0])
            syncm.postSyncVisit(testnode1)
            // console.log("<<<<<<<<<<")
            // console.log(testnode1.children[0])
            fs.writeFileSync("/git/fruitmix/synctest/1234","c7520f65401471a901ec14e84a2b460f1dd1f18ab686a275e9bb8ad0307e5f63")
            let tree=syncm.restoreTreeFromJson(testnode1)
            // console.log(">>>>>>>>>>")
            // console.log(testnode1.children[0])
            // console.log(tree.root)
            // console.log("--------")
            // console.log(testnode1)
            // console.log("--------")
            // console.log(tree.root.children[0])
            expect(tree.root.type).to.equal('folder')
            expect(tree.root.name).to.equal('05e4b6b4-687e-4743-9a51-56711104dd94')
            expect(tree.root.uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b777')
            expect(tree.root.writelist).deep.to.equal([])
            expect(tree.root.readlist).deep.to.equal([])
            expect(tree.root.hash).to.equal('c7520f65401471a901ec14e84a2b460f1dd1f18ab686a275e9bb8ad0307e5f63')
            expect(tree.root.children.length).to.equal(1)
            expect(tree.root.children[0].hash).to.equal('7020b98125da9baa9bb256fa5670b57615a245f3b2ccc6016196abda2ef72efa')
            expect(tree.root.children[0].name).to.equal('ddd')
            expect(tree.root.children[0].type).to.equal('folder')
            expect(tree.root.children[0].writelist).deep.to.equal([])
            expect(tree.root.children[0].readlist).deep.to.equal([])
            expect(tree.root.children[0].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b444')
            expect(tree.root.children[0].parent).to.equal(tree.root)
            expect(tree.root.children[0].children.length).to.equal(3)
            expect(tree.root.children[0].children[0].hash).to.equal('768d9c4383593c4d5ded0ceff81abc9829ea7b8da8c70ea6c00d80cfa3196c17')
            expect(tree.root.children[0].children[0].writelist).deep.to.equal([])
            expect(tree.root.children[0].children[0].readlist).deep.to.equal([])
            expect(tree.root.children[0].children[0].type).to.equal('folder')
            expect(tree.root.children[0].children[0].name).to.equal('aaa')
            expect(tree.root.children[0].children[0].parent).to.equal(tree.root.children[0])
            // console.log('===================')
            // console.log(tree.root.children[0])
            // console.log('-------------------')
            // console.log(tree.root.children[0].children[0].parent)
            expect(tree.root.children[0].children[0].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b111')
            expect(tree.root.children[0].children[0].children.length).to.equal(2)
            expect(tree.root.children[0].children[1].hash).to.equal(33333)
            expect(tree.root.children[0].children[1].writelist).deep.to.equal([])
            expect(tree.root.children[0].children[1].readlist).deep.to.equal([])
            expect(tree.root.children[0].children[1].type).to.equal('file')
            expect(tree.root.children[0].children[1].name).to.equal('eee.txt')
            expect(tree.root.children[0].children[1].parent).to.equal(tree.root.children[0])
            expect(tree.root.children[0].children[1].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b555')
            expect(tree.root.children[0].children[1].children.length).to.equal(0)
            expect(tree.root.children[0].children[2].hash).to.equal(44444)
            expect(tree.root.children[0].children[2].writelist).deep.to.equal([])
            expect(tree.root.children[0].children[2].readlist).deep.to.equal([])
            expect(tree.root.children[0].children[2].type).to.equal('file')
            expect(tree.root.children[0].children[2].name).to.equal('fff.txt')
            expect(tree.root.children[0].children[2].parent).to.equal(tree.root.children[0])
            expect(tree.root.children[0].children[2].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b666')
            expect(tree.root.children[0].children[2].children.length).to.equal(0)
            expect(tree.root.children[0].children[0].children[0].hash).to.equal(22222)
            expect(tree.root.children[0].children[0].children[0].writelist).deep.to.equal([])
            expect(tree.root.children[0].children[0].children[0].readlist).deep.to.equal([])
            expect(tree.root.children[0].children[0].children[0].type).to.equal('file')
            expect(tree.root.children[0].children[0].children[0].name).to.equal('ccc.txt')
            expect(tree.root.children[0].children[0].children[0].parent).to.equal(tree.root.children[0].children[0])
            expect(tree.root.children[0].children[0].children[0].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b333')
            expect(tree.root.children[0].children[0].children[0].children.length).to.equal(0)
            expect(tree.root.children[0].children[0].children[1].hash).to.equal(11111)
            expect(tree.root.children[0].children[0].children[1].writelist).deep.to.equal([])
            expect(tree.root.children[0].children[0].children[1].readlist).deep.to.equal([])
            expect(tree.root.children[0].children[0].children[1].type).to.equal('file')
            expect(tree.root.children[0].children[0].children[1].name).to.equal('bbb.txt')
            expect(tree.root.children[0].children[0].children[1].parent).to.equal(tree.root.children[0].children[0])
            expect(tree.root.children[0].children[0].children[1].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b222')
            expect(tree.root.children[0].children[0].children[1].children.length).to.equal(0)
            done()
          })
        })
      }) 
    })
  })

})

