Pouch Stream
====

Experimental streaming version of PouchDB

```bash
npm install pouchStream
```

```js
var pouchStream = require('pouchStream');
```

Writable
---

note: the docs you give it can have _ids's or not and it will do post or put depending.

```js
var db = new PouchDB('foo');
var stream = pouchStream.writable(db);
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
random(100).pipe(pouchStream.writable(db)).on('end', function () {
  //should now have 100 documents in it
});
```

Readable
---

```js
var db = new PouchDB('foo');
var stream = pouchStream.readable(db);
stream.on('data', function (d) {
  // deal with data
});
```

you can also set `since` 

var stream = pouchStream.readable(db, 19);
stream.on('data', function (d) {
  // deal with data after seq 19
});