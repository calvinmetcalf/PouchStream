Pouch Stream
====

Experimental streaming version of PouchDB

```bash
npm install pouchStream
```

```js
var PouchStream = require('pouchStream');
PouchDB.plugin(PouchStream);
```

Writable
---

note: the docs you give it can have _ids's or not and it will do post or put depending, you can also pass an array for bulk docs, it also takes an option object which will be passed verbatem to bulkDocs, put, or post.

```js
var stream = db.createWriteStream();
stream.write({
  foo: 'bar',
  _id: 'testDoc'
}, function () {
  // chunk is flushed
});
```
quickly fill up a db with random docs with random-document-stream

```js
var random = require("random-document-stream");
random(100).pipe(db.createWriteStream()).on('end', function () {
  //should now have 100 documents in it
});
```

Readable
---

```js
var db = new PouchDB('foo');
var stream = db.createReadStream();
stream.on('data', function (d) {
  // deal with data
});
```

you can also set `since` 

var stream = db.createReadStream({since:19});
stream.on('data', function (d) {
  // deal with data after seq 19
});