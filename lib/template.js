var _ = require('lodash');
var create_data = require('./data');

function Template(core, options) {
    this.core = (typeof core !== 'undefined') ? core : {};
    this.options = (typeof options !== 'undefined') ? options : {};
};

_.extend(Template.prototype, {

    toObject: function (addition) {
        return this._replaceCycle(this.core, create_data(this.core, addition));
    },

    get: function (key, addition) {
        var value = _.cloneDeep(this.core);

        _.each(key.split('.'), function (part) {
            if (typeof value !== 'undefined') {
                value = value[part];
            }
        });

        return this._replaceCycle(value, create_data(this.core, addition));
    },

    _replaceCycle: function (value, data) {
        var _this_ = this;

        if (_.isString(value)) {
            return _this_._replace(value, data);
        }

        if (_.isArray(value) || _.isArguments(value)) {
            return _.map(value, function (v) {
                return _this_._replaceCycle(v, data);
            });
        }

        if (_.isObject(value)) {
            return _.assign({}, value, function (index, v) {
                return _this_._replaceCycle(v, data);
            });
        }

        return value;
    },

    _replace: function (value, data) {
        var steps = [];
        var remaining = this.options.loop_limit || 0x7f;

        var origin = value;

        while (value.indexOf('<%') >= 0) {
            remaining -= 1;

            value = _.template(value, data);

            if (origin === value) {
                break;
            }

            if (_.contains(steps, value) || remaining < 1) {
                throw Error('a template string [' + value + '] is looped');
            }

            steps.push(value);
            origin = value;
        };

        return value;
    }
});


module.exports = function (core, addition) {
    return new Template(core, addition);
};
