var crc = require('crc')
var fs = require('fs')

module.exports = function(mtime,length){
  mtime = Math.floor(mtime)
  return '"'+mtime.toString(16)+'-'+length.toString(16)+'"'
}

module.exports.parse = function(etag){
  var parts = etag.substr(1,etag.length-2).split('-')
  return {
    mtime:parseInt(parts[0]+'',16),
    length:parseInt(parts[1]+'',16)
  }
}

module.exports.contentBased = function(content){
  return module.exports(crc.crc32(content),content.length)
}

module.exports.parseContentBased = function(etag){
  var o = module.exports.parse(etag)
  o.crc = o.mtime 
  delete o.mtime
  return o
}

module.exports.fromFile = function(file,cb){
  fs.stat(file,function(err,stat){
    if(err) return cb(err)
    cb(false,module.exports(stat.mtime/1000,stat.size))
  })
}

module.exports.setContentBased = function(file,cb){
  fs.readFile(file,function(err,buf){
    if(err) return cb(err)
    var checksum = crc.crc32(buf)
    fs.open(file,'r',function(err,fd){
      if(err) return cb(err)
      fs.futimes(fd,checksum,checksum,function(err){
        fs.close(fd,function(){})
        cb(err)
      })
    })
  })
}
