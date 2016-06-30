var test = require('tape')
var etag = require('../')
var crc = require('crc')
var fs = require('fs')

test("can",function(t){
  var mtime = Math.floor(Date.now()/1000)
  var length = 1000
  var tag = etag(mtime,length)

  console.log(tag)

  var o = etag.parse(tag)

  t.equals(o.length,length,'parsed length should equal encoded length')
  t.equals(o.mtime,mtime,'parsed mtime should equal encoded mtime')
  t.end()
})

test("can do content based etags",function(t){
  var content = "i am an apple"
  var checksum = crc.crc32(content)
  var tag = etag.contentBased(content)
  var o = etag.parseContentBased(tag)

  t.equals(o.length,content.length,'parsed length should equal encoded length')
  t.equals(o.crc,checksum,'parsed crc should equal crc32 checksum')
  t.end() 
})

test("can set and reaf content based etags on files",function(t){

  var content = "foo"
  var path = __dirname+'/tmp'
  var checksum = crc.crc32(content)

  fs.writeFileSync(path,content)
  
  etag.setContentBased(path,function(err){
    t.ok(!err)
    etag.fromFile(path,function(err,tag){

      o = etag.parseContentBased(tag)
      console.log(o)

      t.equals(o.crc,checksum,'should have set mtime to checksum value')
      t.equals(o.length,content.length,'should have correct length')
      t.end()
    })
  })

})
