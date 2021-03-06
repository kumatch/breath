var expect = require('chai').expect;
var breath = require('..');

describe('breath template and get key', function () {
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
        var foo      = breath(core).get("foo", addition);
        var a        = breath(core).get("a", addition);
        var a_b      = breath(core).get("a.b", addition);
        var a_b_c    = breath(core).get("a.b.c", addition);
        var list     = breath(core).get("list", addition);
        var list_0   = breath(core).get("list[0]", addition);
        var list_0_1 = breath(core).get("list[0][1]", addition);

        expect(foo).be.equals(core.foo);
        expect(a.b.c).be.equals(core.a.b.c);
        expect(a_b.c).be.equals(core.a.b.c);
        expect(list[0][1]).be.equals(core.list[0][1]);
        expect(list_0[1]).be.equals(core.list[0][1]);
        expect(list_0_1).be.equals(core.list[0][1]);
    });

    it('get replacing value', function () {
        var bar1 = breath(core).get("bar");
        var bar2 = breath(core).get("bar", addition);

        expect(bar1).be.equals("bar with foo");
        expect(bar2).be.equals("bar with 10");

        var a1 = breath(core).get("a");
        var a2 = breath(core).get("a", addition);

        expect(a1.b.d).be.equals("ddd with ccc");
        expect(a2.b.d).be.equals("ddd with 30");

        var a_b1 = breath(core).get("a.b");
        var a_b2 = breath(core).get("a.b", addition);

        expect(a_b1.d).be.equals("ddd with ccc");
        expect(a_b2.d).be.equals("ddd with 30");

        var a_b_d1 = breath(core).get("a.b.d");
        var a_b_d2 = breath(core).get("a.b.d", addition);

        expect(a_b_d1).be.equals("ddd with ccc");
        expect(a_b_d2).be.equals("ddd with 30");

        var list1 = breath(core).get("list");
        var list2 = breath(core).get("list", addition);

        expect(list1[0][2]).be.equals("e");
        expect(list2[0][2]).be.equals("e");

        var list_0_1 = breath(core).get("list.0");
        var list_0_2 = breath(core).get("list.0", addition);

        expect(list_0_1[2]).be.equals("e");
        expect(list_0_1[2]).be.equals("e");

        var list_0_2_1 = breath(core).get("list.0.2");
        var list_0_2_2 = breath(core).get("list.0.2", addition);

        expect(list_0_2_1).be.equals("e");
        expect(list_0_2_2).be.equals("e");
    });

    it('get undefined if key is not defined', function () {
        expect(breath(core).get("baz")).to.be.undefined;
        expect(breath(core).get("list[5]")).to.be.undefined;
    });
});
