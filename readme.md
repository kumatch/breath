jsopt
===========

javascript object properties template on Node.

Usage
-----

```javascript
var jsopt = require('jsopt');

var template = {
    say: {
        hello: "Hello, <%= params.name %>. from <%= params.birth %>."
    },

    params: {
        name: "javascript",
        birth: 1995
    }
};

var data = jsopt(template).toObject();
console.log(data.say.hello); // "Hello, javascript from 1995."

var data2 = jsopt(template).toObject({ params: { birth: "Netscape" } });
console.log(data2.say.hello); // "Hello, javascript from Netscape."

var value = jsopt(template).get('say.hello', { params: { birth: "Mozilla" } });
console.log(value); // "Hello, javascript from Mozilla."
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
