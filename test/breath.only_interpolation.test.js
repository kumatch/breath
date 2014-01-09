var expect = require('chai').expect;
var _ = require('lodash');

var breath = require('../lib/breath');

describe('Only interpolation', function () {

    it('should success replacing', function () {
        var core = {
            foo: "foo, <%= bar %>",
            bar: "bar, <% baz %>",
            baz: "<% quux %>",
            quux: "OK"
        };

        var result = breath(core, { only_interpolation: true }).createSync();

        expect(result.baz).be.equal('OK');
        expect(result.bar).be.equal('bar, OK');
        expect(result.foo).be.equal('foo, bar, OK');
    });

    it('should success replacing with chnages variable rule', function () {
        var core = {
            foo: "foo, {{ bar }}",
            bar: "bar, {{= baz }}",
            baz: "{{quux}}",
            quux: "OK"
        };

        var options = {
            only_interpolation: true,
            opener: '{{',
            closer: '}}'
        };
        var result = breath(core, options).createSync();

        expect(result.baz).be.equal('OK');
        expect(result.bar).be.equal('bar, OK');
        expect(result.foo).be.equal('foo, bar, OK');
    });
});