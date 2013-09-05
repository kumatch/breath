var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');
var template = require('../lib/template');

describe('build a varialble from template', function () {
    var _template_spy;

    beforeEach(function () {
        _template_spy = sinon.spy(_, 'template');
    });

    afterEach(function () {
        _.template.restore();
    });


    it('success for object', function () {
        var foo = "OK";
        var bar = "<%= foo %>";
        var baz = "baz with <%= foo %>";

        var core = {
            foo: foo, bar: bar, baz: baz
        };

        var result = template(core).toObject();

        expect(result.foo).be.equal('OK');
        expect(result.bar).be.equal('OK');
        expect(result.baz).be.equal('baz with OK');

        expect(core.foo).be.equal(foo);
        expect(core.bar).be.equal(bar);
        expect(core.baz).be.equal(baz);
    });

    it('success for array', function () {

        var core = {
            list: [ "OK",
                    "<%= list[0] %>",
                    "str <%= list[0] %>"
                  ]
        };

        var result = template(core).toObject();

        expect(result.list[0]).be.equal('OK');
        expect(result.list[1]).be.equal('OK');
        expect(result.list[2]).be.equal('str OK');
    });


    it('success with same type', function () {
        var core = {
            number: 42,
            string: "a string.",
            array: [ 1, 3, 5 ],
            object: { ok : true },

            test_number1: "to string number <%= number %>",
            test_number2: "<%= number %>",

            test_array1: "to string array <%= array %>",
            test_array2: "<%= array %>",

            test_object1: "to string object <%= object %>",
            test_object2: "<%= object %>"
        };

        var result = template(core).toObject();

        expect(result.test_number1).be.equal('to string number 42');
        expect(result.test_number2).be.equal(core.number);

        expect(result.test_array1).be.equal('to string array 1,3,5');
        expect(result.test_array2).be.deep.equal(core.array);

        expect(result.test_object1).be.equal('to string object [object Object]');
        expect(result.test_object2).be.deep.equal(core.object);
    });


    it('set chained varialble', function () {
        var core = {
            foo: "OK",
            bar: "<%= baz %>",
            baz: "<%= foo %>",

            qux: "str <%= quux %>",
            quux: "str <%= foo %>"
        };

        var result = template(core).toObject();

        expect(result.foo).be.equal('OK');
        expect(result.bar).be.equal('OK');
        expect(result.baz).be.equal('OK');
        expect(result.qux).be.equal('str str OK');
        expect(result.quux).be.equal('str OK');
    });


    it('raise error if variable is not define', function () {
        var core = {
            foo: "OK",
            bar: "<%= foo %>",
            baz: "<%= a %>"
        };

        expect(function () { template(core).toObject(); }).to.throw(ReferenceError);
    });

    it('raise error if loop 2 varialbles', function () {
        var core = {
            foo: "<%= bar %>",
            bar: "<%= foo %>"
        };

        expect(function () { template(core).toObject(); }).to.throw(RangeError);
    });

    it('raise error if loop 2 varialbles with string on default loop limit', function () {
        var core = {
            foo: "foo <%= bar %>",
            bar: "bar <%= foo %>"
        };

        expect(function () { template(core).toObject(); }).to.throw(RangeError);
    });

    it('raise error if loop 2 varialbles cycle with string on options loop limit', function () {
        var core = {
            foo: "foo <%= bar %>",
            bar: "bar <%= foo %>"
        };
        var limit = 5;

        expect(function () { template(core, { loop_limit: limit }).toObject(); }).to.throw(RangeError);
        expect(_template_spy.callCount).be.equals(limit);
    });

    it('raise error if loop many varialbles', function () {
        var core = {
            foo: "<%= bar %>",
            bar: "<%= baz %>",
            baz: "<%= qux %>",
            qux: "<%= quux %>",
            quux: "<%= foo %>"
        };

        expect(function () { template(core).toObject(); }).to.throw(RangeError);
    });

    it('raise error if reference varialble loop with string', function () {
        var core = {
            foo: "<%= bar %>",

            bar: "bar <%= baz %>",
            baz: "baz <%= qux %>",
            qux: "qux <%= quux %>",
            quux: "quux <%= baz %>"
        };

        expect(function () { template(core).toObject(); }).to.throw(RangeError);
    });



    it('replace nested variables', function () {
        var core = {
            foo: "foo <%= bar.baz %> <%= list[0] %>",
            bar: {
                baz: "bar baz <%= qux.quux %>"
            },
            qux: {
                quux: "OK <%= list[1][2] %>"
            },


            list: [
                "A",
                [
                    "<%= list[0] %>", "<%= qux.quux %>", "D"
                ]
            ]
        };

        var result = template(core).toObject();

        expect(result.foo).be.equal('foo bar baz OK D A');
        expect(result.bar.baz).be.equal('bar baz OK D');
        expect(result.list[0]).be.equal('A');
        expect(result.list[1][0]).be.equal('A');
        expect(result.list[1][1]).be.equal('OK D');
    });

    it('raise error if loop nested variables', function () {
        var core = {
            a: {
                b: {
                    c: "1. <%= d.e.f %>"
                }
            },

            d: {
                e: {
                    f: "2. <%= a.b.c %>"
                }
            }
        };

        expect(function () { template(core).toObject(); }).to.throw(RangeError);
    });
});