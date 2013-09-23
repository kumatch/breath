breath
===========

builds a javascript variable from a template.


Install
-----

    $ npm install breath



Usage
-----

```javascript
var breath = require('breath');

var template = {
    say: {
        hello: "Hello <%= params.name %> (<%= params.birth %>)"
    },

    params: {
        name: "javascript",
        birth: 1995
    }
};

var obj1 = breath(template).createSync();
console.log(obj1.say.hello); // "Hello javascript (1995)"

var obj2 = breath(template).createSync({ params: { birth: "by Netscape" } });
console.log(obj2.say.hello); // "Hello javascript (by Netscape)"

var value = breath(template).get('say.hello', { params: { name: "Node", birth: 2009 } });
console.log(value); // "Hello Node (2009)"

// async
breath(template).create(function (err, obj) {
    //...
});

breath(template).create({ params: { name: "world" }}, function (err, obj) {
    //...
});
```



License
--------

Licensed under the MIT License.

Copyright (c) 2013 Yosuke Kumakura

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
