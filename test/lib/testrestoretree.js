import path from 'path'
import fs from 'fs'

import rimraf from 'rimraf'
import mkdirp from 'mkdirp'
import xattr from 'fs-xattr'
import { expect } from 'chai'

import { replacechild ,restoretree,tojsonobj,buildanewtree} from '../../src/lib/restoretree'

describe('restoretree', function() {

  describe('replacenode', function() {

    it('newnode should replace oldnode', function(done) {
      let newnode=[{uuid:321,hash:222}]
      let tree={uuid:123,children:[]}
      replacechild(tree,newnode)
      expect(tree.uuid).to.equal(123)
      expect(tree.children.length).to.equal(1)
      expect(tree.children[0].uuid).to.equal(321)
      expect(tree.children[0].hash).to.equal(222)
      done()
    })
  })

  describe('restoretree', function() {

    it('should restore a tree from a json', function(done) {
      
      let testjson='{"children":[{"name":"bcb","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2765"},{"name":"abc","parent":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","size":2,"type":"file","uuid":"fa3f6a95-c1c9-4412-82a1-a80948bd2567"}],"hash":"","name":"05e4b6b4-687e-4743-9a51-56711104dd94","parent":null,"readlist":[],"type":"folder","uuid":"8c594bb5-19b3-45c4-bb30-c894e176b3bf","writelist":[]}'
      let jsonobj = tojsonobj(testjson)
      let newtree=restoretree(jsonobj)
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
      let newtree=restoretree(jsonobj)
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

  describe('buildnewtree', function() {

    it('should build a newtree from files', function(done) {
      let tree = buildanewtree('1234')
      expect(tree.type).to.equal('folder')
      expect(tree.name).to.equal('05e4b6b4-687e-4743-9a51-56711104dd94')
      expect(tree.uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b777')
      expect(tree.writelist).deep.to.equal([])
      expect(tree.readlist).deep.to.equal([])
      expect(tree.hash).to.equal('db92d75bea798cdb1727f06b75b993736e5f152ac3675e69690c855c74b3a0a5')
      expect(tree.children.length).to.equal(1)
      expect(tree.children[0].hash).to.equal('874c1bc8f9d913ea749a2a77e8c6a77dabe2fd572722b8e18b58acc0c8a163bc')
      expect(tree.children[0].name).to.equal('ddd')
      expect(tree.children[0].type).to.equal('folder')
      expect(tree.children[0].writelist).deep.to.equal([])
      expect(tree.children[0].readlist).deep.to.equal([])
      expect(tree.children[0].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b444')
      expect(tree.children[0].parent).to.equal(tree)
      expect(tree.children[0].children.length).to.equal(3)
      expect(tree.children[0].children[0].hash).to.equal('61f07e51ab6a1b3fde2d48c02a2debc399fd7ca2e280631fd50546eb5f116a4d')
      expect(tree.children[0].children[0].writelist).deep.to.equal([])
      expect(tree.children[0].children[0].readlist).deep.to.equal([])
      expect(tree.children[0].children[0].type).to.equal('folder')
      expect(tree.children[0].children[0].name).to.equal('aaa')
      expect(tree.children[0].children[0].parent).to.equal(tree.children[0])
      expect(tree.children[0].children[0].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b111')
      expect(tree.children[0].children[0].children.length).to.equal(2)
      expect(tree.children[0].children[1].hash).to.equal(33333)
      expect(tree.children[0].children[1].writelist).deep.to.equal([])
      expect(tree.children[0].children[1].readlist).deep.to.equal([])
      expect(tree.children[0].children[1].type).to.equal('file')
      expect(tree.children[0].children[1].name).to.equal('eee.txt')
      expect(tree.children[0].children[1].parent).to.equal(tree.children[0])
      expect(tree.children[0].children[1].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b555')
      expect(tree.children[0].children[1].children.length).to.equal(0)
      expect(tree.children[0].children[2].hash).to.equal(44444)
      expect(tree.children[0].children[2].writelist).deep.to.equal([])
      expect(tree.children[0].children[2].readlist).deep.to.equal([])
      expect(tree.children[0].children[2].type).to.equal('file')
      expect(tree.children[0].children[2].name).to.equal('fff.txt')
      expect(tree.children[0].children[2].parent).to.equal(tree.children[0])
      expect(tree.children[0].children[2].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b666')
      expect(tree.children[0].children[2].children.length).to.equal(0)
      expect(tree.children[0].children[0].children[0].hash).to.equal(22222)
      expect(tree.children[0].children[0].children[0].writelist).deep.to.equal([])
      expect(tree.children[0].children[0].children[0].readlist).deep.to.equal([])
      expect(tree.children[0].children[0].children[0].type).to.equal('file')
      expect(tree.children[0].children[0].children[0].name).to.equal('ccc.txt')
      expect(tree.children[0].children[0].children[0].parent).to.equal(tree.children[0].children[0])
      expect(tree.children[0].children[0].children[0].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b333')
      expect(tree.children[0].children[0].children[0].children.length).to.equal(0)
      expect(tree.children[0].children[0].children[1].hash).to.equal(11111)
      expect(tree.children[0].children[0].children[1].writelist).deep.to.equal([])
      expect(tree.children[0].children[0].children[1].readlist).deep.to.equal([])
      expect(tree.children[0].children[0].children[1].type).to.equal('file')
      expect(tree.children[0].children[0].children[1].name).to.equal('bbb.txt')
      expect(tree.children[0].children[0].children[1].parent).to.equal(tree.children[0].children[0])
      expect(tree.children[0].children[0].children[1].uuid).to.equal('8c594bb5-19b3-45c4-bb30-c894e176b222')
      expect(tree.children[0].children[0].children[1].children.length).to.equal(0)
      done()
    })
  })

})