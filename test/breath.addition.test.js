var expect = require('chai').expect;
var _ = require('lodash');
var breath = require('..');

describe('breath template with additional object', function () {

    it('success', function () {
        var foo = "OK";
        var bar = "<%= foo %>";
        var baz = "baz with <%= bar %>";
        var qux = "qux with <%= a.b.c %>";
        var quux = "quux with <%= d[0][1] %>";

        var core = {
            foo: foo, bar: bar, baz: baz, qux: qux, quux: quux
        };

        var addition = {
            bar: "aaa", baz: "bbb",
            a: {
                b: {
                    c: "ccc"
                }
            },
            d: [
                [ "d", "e", "f" ]
            ]
        };

        var result = breath(core).createSync(addition);

        expect(result.foo).be.equal('OK');
        expect(result.bar).be.equal('OK');
        expect(result.baz).be.equal('baz with aaa');
        expect(result.qux).be.equal('qux with ccc');
        expect(result.quux).be.equal('quux with e');

        expect(core.foo).be.equal(foo);
        expect(core.bar).be.equal(bar);
        expect(core.baz).be.equal(baz);
        expect(core.qux).be.equal(qux);
        expect(core.quux).be.equal(quux);

        expect(addition.foo).to.be.undefined;
        expect(addition.bar).be.equal("aaa");
        expect(addition.baz).be.equal("bbb");
        expect(addition.a.b.c).be.equal("ccc");
        expect(addition.d[0][0]).be.equal("d");
        expect(addition.d[0][1]).be.equal("e");
        expect(addition.d[0][2]).be.equal("f");
    });

    it('no raise error if loop variables but additional object is not loop', function () {
        var core = {
            foo: "<%= bar %>",
            bar: "<%= foo %>"
        };

        var addition = {
            foo: "aaa", bar: "bbb"
        };

            var result = breath(core).createSync(addition);

        expect(result.foo).be.equal('bbb');
        expect(result.bar).be.equal('aaa');
    });

    it('raise error if loop in additional object', function () {
        var core = {
            foo: "<%= a %>"
        };

        var addition = {
            a: "<%= b %>", b: "<%= a %>"
        };

        expect(function () { breath(core).createSync(addition); }).to.throw(RangeError);
    });

    it('raise error if loop core and additional objects', function () {
        var core = {
            foo: "<%= bar %>"
        };

        var addition = {
            bar: "<%= foo %>"
        };

        expect(function () { breath(core).createSync(addition); }).to.throw(RangeError);
    });
});
