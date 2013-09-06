var expect = require('chai').expect;
var async = require('async');
var breath = require('..');

describe('build a varialble from template async', function () {
    var _template_spy;

    it('success for object async', function (done) {
        var foo = "OK";
        var bar = "<%= foo %>";
        var baz = "baz with <%= foo %>";

        var core = {
            foo: foo, bar: bar, baz: baz
        };

        breath(core).create(function (err, result) {
            if (err) {
                done(err);
                return;
            }

            expect(result.foo).be.equal('OK');
            expect(result.bar).be.equal('OK');
            expect(result.baz).be.equal('baz with OK');

            expect(core.foo).be.equal(foo);
            expect(core.bar).be.equal(bar);
            expect(core.baz).be.equal(baz);

            done();
        });
    });

    it('success for array', function (done) {

        var core = {
            list: [ "OK",
                    "<%= list[0] %>",
                    "str <%= list[0] %>"
                  ]
        };

        breath(core).create( function (err, result) {
            if (err) {
                done(err);
                return;
            }

            expect(result.list[0]).be.equal('OK');
            expect(result.list[1]).be.equal('OK');
            expect(result.list[2]).be.equal('str OK');

            done();
        });
    });


    it('success for object and array, with addition', function (done) {
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

        breath(core).create(addition, function (err, result) {
            if (err) {
                done(err);
                return;
            }

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

            done();
        });
    });

    it('raise error if variable is not define', function (done) {
        var core = {
            foo: "OK",
            bar: "<%= foo %>",
            baz: "<%= a %>"
        };

        breath(core).create(function (err, result) {
            expect(err).to.be.instanceOf(ReferenceError);
            expect(result).to.be.undefined;

            done();
        });
    });

    it('raise error if loop variable 1', function (done) {
        var core = {
            foo: "foo <%= bar %>",
            bar: "bar <%= foo %>",
        };

        breath(core).create(function (err, result) {
            expect(err).to.be.instanceOf(RangeError);
            expect(result).to.be.undefined;

            done();
        });
    });

    it('raise error if loop variable 2', function (done) {
        var core = {
            foo: "<%= bar %>",
            bar: "<%= foo %>",
        };

        breath(core).create(function (err, result) {
            expect(err).to.be.instanceOf(RangeError);
            expect(result).to.be.undefined;

            done();
        });
    });
});