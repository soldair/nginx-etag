var crypto = require('crypto')
var fs = require('fs')
var eos = require('end-of-stream')

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
  return module.exports(md5number(content),content.length)
}

module.exports.parseContentBased = function(etag){
  var o = module.exports.parse(etag)
  o.checksum = o.mtime 
  return o
}

module.exports.fromFile = function(file,cb){
  fs.stat(file,function(err,stat){
    if(err) return cb(err)
    cb(false,module.exports(stat.mtime/1000,stat.size))
  })
}

module.exports.setContentBased = function(file,cb){
  var hash = crypto.createHash('md5')
  var rs = fs.createReadStream(file).on('data',function(buf){
    hash.update(buf)
  })
  eos(rs,function(err){
    if(err) return cb(err)
    var checksum = hash.digest().readUInt32BE()
    fs.utimes(file,checksum,checksum,function(err){
      cb(err)
    })
  })
}

module.exports.md5Number = md5number

function md5number(content){
  return crypto.createHash('md5').update(content).digest().readUInt32BE()
}
