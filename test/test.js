var test = require('tape')
var etag = require('../')

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
