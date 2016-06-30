
module.exports = function(mtime,length){
  return '"'+mtime.toString(16)+'-'+length.toString(16)+'"'
}

module.exports.parse = function(etag){
  var parts = etag.substr(1,etag.length-2).split('-')
  return {
    mtime:parseInt(parts[0]+'',16),
    length:parseInt(parts[1]+'',16)
  }
}


