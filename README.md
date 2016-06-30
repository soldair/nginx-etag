# nginx-etag
generate an etag like nginx

```
var etag = require('nginx-etag')

var tag = etag(Date.now()/1000,10)

console.log(tag)

```
will print something like `'"57755bb3-a"'`

## api

### tag = etag(modified timestamp in seconds, length on content)

### object = etag.parse(tag)
 - object.mtime
 - object.length

### etag.fromFile(filePath,callback)
  - filePath is the path the the file you want to generate a tag for
  - callback(err,tag) 

## content based api

### tag = etag.contentBased(content)
rather than using the modified time value directly passes the crc32 of the content to use as the basis for the etag

### object = etag.parseContentBased(tag)
 - object.crc
 - object.length

### etag.setContentBased(filePath,callback)
  this sets the file's modified timestamp to the crc of it's data.
  because nginx uses the mtime this allows you to make etags that can be distributed accross hosts with only the data itself.
  
  - filePath is the path the the file that you want toupdate the mtime for.
  - callback(err)

to read the etag correctly be sure to pass to `etag.parseContentBased`

example.
```js
etag.fromFile(filePath,function(err,tag){
  var obj = etag.parseContentBased(tag)
  console.log(obj)
})
``

`
