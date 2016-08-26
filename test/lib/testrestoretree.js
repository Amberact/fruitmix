import path from 'path'
import fs from 'fs'

import rimraf from 'rimraf'
import mkdirp from 'mkdirp'
import xattr from 'fs-xattr'
import { expect } from 'chai'

import { replacechild ,restoretree,tojsonobj,buildanewtree} from '../../src/lib/restoretree'

describe('restoretree', function() {

  // describe('replacechild', function() {

  //   it('newnode should replace child', function(done) {
  //     let child=[{uuid:321,hash:222}]
  //     let oldnode={uuid:123,children:[]}
  //     replacechild(oldnode,child)
  //     expect(oldnode.uuid).to.equal(123)
  //     expect(oldnode.children.length).to.equal(1)
  //     expect(oldnode.children[0].uuid).to.equal(321)
  //     expect(oldnode.children[0].hash).to.equal(222)
  //     done()
  //   })
  // })

  describe('restoretree', function() {

    it('should restore a tree from a json', function(done) {
      
      let testjson='{"children":[{"name":"bcb","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2765"},{"name":"abc","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2567"}],"hash":"","name":"05e4b6b4-687e-4743-9a51-56711104dd94","parent":null,"readlist":[],"type":"folder","uuid":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","writelist":[]}'
      let jsonobj = tojsonobj(testjson)
      let newtree=restoretree(jsonobj)
      console.log(newtree.root.children[0])
      expect(newtree.root.type).to.equal('folder')
      expect(newtree.root.hash).to.equal('')
      expect(newtree.root.uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b3bf')
      expect(newtree.root.name).to.equal('05e4b6b4-687e-4743-9a51-56711104dd94')
      expect(newtree.root.parent).to.equal(null)
      expect(newtree.root.readlist).deep.to.equal([])
      expect(newtree.root.writelist).deep.to.equal([])
      expect(newtree.root.children.length).to.equal(2)
      expect(newtree.root.children[0].name).to.equal('bcb')
      expect(newtree.root.children[0].parent).to.equal(newtree.root)
      expect(newtree.root.children[0].size).to.equal(2)
      expect(newtree.root.children[0].type).to.equal('file')
      expect(newtree.root.children[0].uuid).to.equal('fa3f6a95-c1c9-4412-82a1-a80948bd2765')
      expect(newtree.root.children[1].name).to.equal('abc')
      expect(newtree.root.children[1].parent).to.equal(newtree.root)
      expect(newtree.root.children[1].size).to.equal(2)
      expect(newtree.root.children[1].type).to.equal('file')
      expect(newtree.root.children[1].uuid).to.equal('fa3f6a95-c1c9-4412-82a1-a80948bd2567')

      done()
    })
  })

  describe('tojsonobj', function() {

    it('should restore a tree from a json', function(done) {
      let uuid='123456'
      let testjson='{"children":[{"name":"bcb","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2765"},{"name":"abc","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2567"}],"hash":"","name":"05e4b6b4-687e-4743-9a51-56711104dd94","parent":null,"readlist":[],"type":"folder","uuid":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","writelist":[]}'
      let jsonobj = tojsonobj(testjson)
      expect(jsonobj.type).to.equal('folder')
      expect(jsonobj.hash).to.equal('')
      expect(jsonobj.uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b3bf')
      expect(jsonobj.name).to.equal('05e4b6b4-687e-4743-9a51-56711104dd94')
      expect(jsonobj.parent).to.equal(null)
      expect(jsonobj.readlist).deep.to.equal([])
      expect(jsonobj.writelist).deep.to.equal([])
      expect(jsonobj.children.length).to.equal(2)
      expect(jsonobj.children[0].name).to.equal('bcb')
      expect(jsonobj.children[0].parent).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b3bf')
      expect(jsonobj.children[0].size).to.equal(2)
      expect(jsonobj.children[0].type).to.equal('file')
      expect(jsonobj.children[0].uuid).to.equal('fa3f6a95-c1c9-4412-82a1-a80948bd2765')
      expect(jsonobj.children[1].name).to.equal('abc')
      expect(jsonobj.children[1].parent).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b3bf')
      expect(jsonobj.children[1].size).to.equal(2)
      expect(jsonobj.children[1].type).to.equal('file')
      expect(jsonobj.children[1].uuid).to.equal('fa3f6a95-c1c9-4412-82a1-a80948bd2567')

      done()
    })
  })

  describe('buildnewtree', function() {

    it('should build a newtree from files', function(done) {
      let tree = buildanewtree('1234')
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