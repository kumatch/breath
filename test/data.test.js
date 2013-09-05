var expect = require('chai').expect;
var create_data = require('../lib/data');

describe('breath data object', function () {
    var core = {
        foo: "a",
        bar: {
            baz: "b",
            qux: {
                quux: "c",
                corge: "d"
            }
        }
    };

    var addition = {
        foo: "x",
        bar: {
            qux: {
                quux: "y"
            }
        },

        a: {
            b: [ 1, 3, 5 ]
        }
    };


    it('create core object only', function () {
        var data = create_data(core);

        expect(data.foo).be.equal(core.foo);
        expect(data.bar.baz).be.equal(core.bar.baz);
        expect(data.bar.qux.quux).be.equal(core.bar.qux.quux);
        expect(data.bar.qux.corge).be.equal(core.bar.qux.corge);

        data.foo = "foo";
        data.bar.baz = "barbaz";
        data.bar.qux.quux = "barqux";

        expect(data.foo).be.not.equal(core.foo);
        expect(data.bar.baz).be.not.equal(core.bar.baz);
        expect(data.bar.qux.quux).be.not.equal(core.bar.qux.quux);
        expect(data.bar.qux.corge).be.equal(core.bar.qux.corge);
    });

    it('create core object with addition object', function () {
        var data = create_data(core, addition);

        expect(data.foo).be.equal(addition.foo);
        expect(data.bar.baz).be.equal(core.bar.baz);
        expect(data.bar.qux.quux).be.equal(addition.bar.qux.quux);
        expect(data.bar.qux.corge).be.equal(core.bar.qux.corge);
        expect(data.a.b[0]).be.equal(addition.a.b[0]);
        expect(data.a.b[1]).be.equal(addition.a.b[1]);
        expect(data.a.b[2]).be.equal(addition.a.b[2]);

        data.foo = "foo";
        data.bar.baz = "barbaz";
        data.bar.qux.corge = "barquxcorge";

        expect(data.foo).be.not.equal(core.foo);
        expect(data.foo).be.not.equal(addition.foo);
        expect(data.bar.baz).be.not.equal(core.bar.baz);
        expect(data.bar.qux.corge).be.not.equal(core.bar.qux.corge);

        addition.bar.qux.quux = "barquxquux";

        expect(data.bar.qux.quux).be.not.equal(core.bar.qux.quux);
        expect(data.bar.qux.quux).be.not.equal(addition.bar.qux.quux);
    });
});