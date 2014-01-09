var expect = require('chai').expect;
var create_data = require('../lib/data');

describe('data creator', function () {
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

    it('should create a new object from a core object', function () {
        var values = create_data(core);

        expect(values.foo).be.equal(core.foo);
        expect(values.bar.baz).be.equal(core.bar.baz);
        expect(values.bar.qux.quux).be.equal(core.bar.qux.quux);
        expect(values.bar.qux.corge).be.equal(core.bar.qux.corge);

        values.foo = "foo";
        values.bar.baz = "barbaz";
        values.bar.qux.quux = "barqux";

        expect(values.foo).be.not.equal(core.foo);
        expect(values.bar.baz).be.not.equal(core.bar.baz);
        expect(values.bar.qux.quux).be.not.equal(core.bar.qux.quux);
        expect(values.bar.qux.corge).be.equal(core.bar.qux.corge);
    });

    it('should create a new marged object from a core object with addition object', function () {
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

        var values = create_data(core, addition);

        expect(values.foo).be.equal(addition.foo);
        expect(values.bar.baz).be.equal(core.bar.baz);
        expect(values.bar.qux.quux).be.equal(addition.bar.qux.quux);
        expect(values.bar.qux.corge).be.equal(core.bar.qux.corge);
        expect(values.a.b[0]).be.equal(addition.a.b[0]);
        expect(values.a.b[1]).be.equal(addition.a.b[1]);
        expect(values.a.b[2]).be.equal(addition.a.b[2]);

        values.foo = "foo";
        values.bar.baz = "barbaz";
        values.bar.qux.corge = "barquxcorge";

        expect(values.foo).be.not.equal(core.foo);
        expect(values.foo).be.not.equal(addition.foo);
        expect(values.bar.baz).be.not.equal(core.bar.baz);
        expect(values.bar.qux.corge).be.not.equal(core.bar.qux.corge);

        addition.bar.qux.quux = "barquxquux";

        expect(values.bar.qux.quux).be.not.equal(core.bar.qux.quux);
        expect(values.bar.qux.quux).be.not.equal(addition.bar.qux.quux);
    });
});