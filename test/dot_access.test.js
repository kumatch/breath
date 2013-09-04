var expect = require('chai').expect;
var dot_access = require('../lib/dot_access');

describe('dot access', function () {

    it('no nest object', function () {
        var data = {
            foo: 10, bar: 20
        };

        expect(dot_access(data, "foo")).be.equals(data.foo);
        expect(dot_access(data, "bar")).be.equals(data.bar);

    });

    it('nested object', function () {
        var data = {
            foo: {
                bar: {
                    baz: "OK"
                }
            }
        };

        expect(dot_access(data, "foo")).be.equals(data.foo);
        expect(dot_access(data, "foo.bar")).be.equals(data.foo.bar);
        expect(dot_access(data, "foo.bar.baz")).be.equals(data.foo.bar.baz);

        expect(dot_access(data, "foo.bar['baz']")).be.equals(data.foo.bar.baz);
        expect(dot_access(data, "foo['bar']['baz']")).be.equals(data.foo.bar.baz);
        expect(dot_access(data, "foo['bar'].baz")).be.equals(data.foo.bar.baz);
    });

    it('no nest array', function () {
        var data = [ 10, 20 ];

        expect(dot_access(data, "0")).be.equals(data[0]);
        expect(dot_access(data, "1")).be.equals(data[1]);

    });

    it('nested array', function () {
        var data = [
            "level 1",
            [
                "level 2",
                [
                    "level 3",
                    [ "OK" ]
                ]
            ]
        ];

        expect(dot_access(data, "0")).be.equals(data[0]);
        expect(dot_access(data, "1.0")).be.equals(data[1][0]);
        expect(dot_access(data, "1.1.0")).be.equals(data[1][1][0]);
        expect(dot_access(data, "1.1.1.0")).be.equals("OK");

        expect(dot_access(data, "1.1.1[0]")).be.equals("OK");
        expect(dot_access(data, "1.1[1][0]")).be.equals("OK");
        expect(dot_access(data, "1[1][1][0]")).be.equals("OK");
        expect(dot_access(data, "[1][1][1][0]")).be.equals("OK");
        expect(dot_access(data, "[1][1][1].0")).be.equals("OK");
        expect(dot_access(data, "[1].1[1].0")).be.equals("OK");
    });

    it('nested object and array', function () {

        var data1 = {
            foo: [
                "foo level 1",
                {
                    bar: {
                        baz: [ "OK" ]
                    }
                }
            ]
        };

        var data2 = [
            "level 1",
            {
                foo: [
                    "level 2",
                    {
                        bar: "OK"
                    }
                ]
            }
        ];

        expect(dot_access(data1, "foo.1.bar.baz.0")).be.equals("OK");
        expect(dot_access(data2, "1.foo.1.bar")).be.equals("OK");
    });


    it('nest and undefined ', function () {
        var data = {
            foo: {
                bar: [ "OK" ]
            }
        };

        expect(dot_access(data, "a")).to.be.undefined;
        expect(dot_access(data, "foo.a")).to.be.undefined;
        expect(dot_access(data, "foo.bar.42")).to.be.undefined;

        expect(function () { dot_access(data, "a.b"); }).to.throw(TypeError);
    });

});