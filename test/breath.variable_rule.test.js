var expect = require('chai').expect;
var _ = require('lodash');

var breath = require('../lib/breath');

describe('setTemplateVariableRule()', function () {
    var core = {
        foo: 'foo {{=a}} and <%= a %>',

        bar: {
            baz: {
                qux: [ 'bar baz qux {{= b.c[1] }} and <%= b.c[1] %>' ]
            }
        }
    };
    var addition = {
        a: "OK",
            b: {
                c: [ "aaa", "bbb" ]
            }
    };

    it('should chnage a variable rule', function () {
        var origin  = breath(core).createSync(addition);
        var changes = breath(core).setTemplateVariableRule('{{', '}}').createSync(addition);

        expect(origin.foo).be.equal('foo {{=a}} and OK');
        expect(origin.bar.baz.qux[0]).be.equal('bar baz qux {{= b.c[1] }} and bbb');

        expect(changes.foo).be.equal('foo OK and <%= a %>');
        expect(changes.bar.baz.qux[0]).be.equal('bar baz qux bbb and <%= b.c[1] %>');
    });

    it('should success replacing if changes rule with replacing chain', function () {
        var changes = breath({ foo: "foo with {{=a}}"}).setTemplateVariableRule('{{', '}}').createSync({ a: "a and {{= b }}", b: "b and {{= c }}", c: "c" });

        expect(changes.foo).be.equal('foo with a and b and c');
    });
});