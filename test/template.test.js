var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');
var template = require('../lib/template');

describe('jsote template', function () {
    var _template_spy;
    // var template, _template_spy;

    beforeEach(function () {
        _template_spy = sinon.spy(_, 'template');
    });

    afterEach(function () {
        _.template.restore();
    });


    it('success', function () {
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

    it('success with same type', function () {
        var core = {
            number: 42,
            string: "a string.",
            array: [ 1, 3, 5 ],
            objct: { ok : true },

            test_number1: "to string number <%= number %>",
            test_number2: "<%= number %>"
        };

        var result = template(core).toObject();

        expect(result.test_number1).be.equal('to string number 42');
        //expect(result.test_number2).be.equal(core.number);
    });


    it('set chained varialble', function () {
        var core = {
            foo: "OK",
            bar: "bar <%= baz %>",
            baz: "baz <%= foo %>"
        };

        var result = template(core).toObject();

        expect(result.foo).be.equal('OK');
        expect(result.bar).be.equal('bar baz OK');
        expect(result.baz).be.equal('baz OK');
    });


    it('raise error if variable is not define', function (done) {
        var core = {
            foo: "OK",
            bar: "<%= foo %>",
            baz: "<%= a %>"
        };

        try {
            template(core).toObject();
            done(Error('not raise error'));
        } catch (e)  {
            expect(e.name).be.equals('ReferenceError');
            done();
        }
    });

    it('raise error if loop 2 varialbles', function (done) {
        var core = {
            foo: "<%= bar %>",
            bar: "<%= foo %>"
        };

        try {
            template(core).toObject();
            done(Error('not raise error'));
        } catch (e)  {
            expect(e.name).be.equals('Error');
            done();
        }
    });

    it('raise error if loop 2 varialbles with string on default loop limit', function (done) {
        var core = {
            foo: "foo <%= bar %>",
            bar: "bar <%= foo %>"
        };

        try {
            template(core).toObject();
            done(Error('not raise error'));
        } catch (e)  {
            expect(e.name).be.equals('Error');
            expect(_template_spy.callCount).be.equals(0x7f);

            done();
        }
    });

    it('raise error if loop 2 varialbles cycle with string on options loop limit', function (done) {
        var core = {
            foo: "foo <%= bar %>",
            bar: "bar <%= foo %>"
        };
        var limit = 5;

        try {
            template(core, { loop_limit: limit }).toObject();
            done(Error('not raise error'));
        } catch (e)  {
            expect(e.name).be.equals('Error');
            expect(_template_spy.callCount).be.equals(limit);

            done();
        }
    });

    it('raise error if loop many varialbles', function (done) {
        var core = {
            foo: "<%= bar %>",
            bar: "<%= baz %>",
            baz: "<%= qux %>",
            qux: "<%= quux %>",
            quux: "<%= foo %>"
        };

        try {
            template(core).toObject();
            done(Error('not raise error'));
        } catch (e)  {
            expect(e.name).be.equals('Error');
            done();
        }
    });

    it('raise error if reference varialble loop with string', function (done) {
        var core = {
            foo: "<%= bar %>",

            bar: "bar <%= baz %>",
            baz: "baz <%= qux %>",
            qux: "qux <%= quux %>",
            quux: "quux <%= baz %>"
        };

        try {
            template(core).toObject();
            done(Error('not raise error'));
        } catch (e)  {
            expect(e.name).be.equals('Error');
            done();
        }
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

    it('raise error if loop nested variables', function (done) {
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

        try {
            template(core).toObject();
            done(Error('not raise error'));
        } catch (e)  {
            expect(e.name).be.equals('Error');
            done();
        }
    });


    describe('with additional object', function () {

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

            var result = template(core).toObject(addition);

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

            var result = template(core).toObject(addition);

            expect(result.foo).be.equal('bbb');
            expect(result.bar).be.equal('aaa');
        });

        it('raise error if loop in additional object', function (done) {
            var core = {
                foo: "<%= a %>"
            };

            var addition = {
                a: "<%= b %>", b: "<%= a %>"
            };

            try {
                template(core).toObject(addition);
                done(Error('not raise error'));
            } catch (e)  {
                expect(e.name).be.equals('Error');
                done();
            }
        });

        it('raise error if loop core and additional objects', function (done) {
            var core = {
                foo: "<%= bar %>"
            };

            var addition = {
                bar: "<%= foo %>"
            };

            try {
                template(core).toObject(addition);
                done(Error('not raise error'));
            } catch (e)  {
                expect(e.name).be.equals('Error');
                done();
            }
        });
    });


    describe('get value by key', function () {
        var core = {
            foo: "foo",
            bar: "bar with <%= foo %>",

            a: {
                b: {
                    c: "ccc",
                    d: "ddd with <%= a.b.c %>"
                }
            },

            list: [
                [ "e", "f", "<%= list[0][0] %>" ]
            ]
        };
        var addition = {
            foo: 10,
            bar: 20,
            a: {
                b: {
                    c: 30
                }
            }
        };

        it('get no replacing value', function () {
            var foo = template(core).get("foo", addition);
            var a = template(core).get("a", addition);
            var a_b = template(core).get("a.b", addition);
            var a_b_c = template(core).get("a.b.c", addition);
            var list = template(core).get("list", addition);
            var list_0 = template(core).get("list.0", addition);
            var list_0_1 = template(core).get("list.0.1", addition);

            expect(foo).be.equals(core.foo);
            expect(a.b.c).be.equals(core.a.b.c);
            expect(a_b.c).be.equals(core.a.b.c);
            expect(list[0][1]).be.equals(core.list[0][1]);
            expect(list_0[1]).be.equals(core.list[0][1]);
            expect(list_0_1).be.equals(core.list[0][1]);
        });

        it('get replacing value', function () {
            var bar1 = template(core).get("bar");
            var bar2 = template(core).get("bar", addition);

            expect(bar1).be.equals("bar with foo");
            expect(bar2).be.equals("bar with 10");

            var a1 = template(core).get("a");
            var a2 = template(core).get("a", addition);

            expect(a1.b.d).be.equals("ddd with ccc");
            expect(a2.b.d).be.equals("ddd with 30");

            var a_b1 = template(core).get("a.b");
            var a_b2 = template(core).get("a.b", addition);

            expect(a_b1.d).be.equals("ddd with ccc");
            expect(a_b2.d).be.equals("ddd with 30");

            var a_b_d1 = template(core).get("a.b.d");
            var a_b_d2 = template(core).get("a.b.d", addition);

            expect(a_b_d1).be.equals("ddd with ccc");
            expect(a_b_d2).be.equals("ddd with 30");

            var list1 = template(core).get("list");
            var list2 = template(core).get("list", addition);

            expect(list1[0][2]).be.equals("e");
            expect(list2[0][2]).be.equals("e");

            var list_0_1 = template(core).get("list.0");
            var list_0_2 = template(core).get("list.0", addition);

            expect(list_0_1[2]).be.equals("e");
            expect(list_0_1[2]).be.equals("e");

            var list_0_2_1 = template(core).get("list.0.2");
            var list_0_2_2 = template(core).get("list.0.2", addition);

            expect(list_0_2_1).be.equals("e");
            expect(list_0_2_2).be.equals("e");
        });

        it('get undefined if key is not defined', function () {
            expect(template(core).get("baz")).to.be.undefined;
            expect(template(core).get("qux.quux")).to.be.undefined;
            expect(template(core).get("path.0.to.1")).to.be.undefined;
        });
    });
});