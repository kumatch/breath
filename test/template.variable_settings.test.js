var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');
var template = require('../lib/template');

describe('breath template settings', function () {
    var core = {
        foo: 'foo {{= a }} and <%= a %>',

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

    it('change and success', function () {
        var result = template(core).toObject(addition);

            expect(result.foo).be.equal('foo {{= a }} and OK');
        expect(result.bar.baz.qux[0]).be.equal('bar baz qux {{= b.c[1] }} and bbb');
    });

    it('no change and success', function () {
        var result = template(core).setTemplateVariable('{{', '}}').toObject(addition);

        expect(result.foo).be.equal('foo OK and <%= a %>');
        expect(result.bar.baz.qux[0]).be.equal('bar baz qux bbb and <%= b.c[1] %>');
    });
});