var _ = require('lodash');
var create_data = require('./data');
var dot_access = require('./dot_access');

function createTemplateVariableRule (opener, closer) {
    var VARIABLE_NAME_PATTERN = '([\\s\\S]+?)';

    var escapeOpener = opener.replace(/(.)/g, '\\$1');
    var escapeCloser = VARIABLE_NAME_PATTERN + closer.replace(/(.)/g, '\\$1');

    return {
        evaluate    : new RegExp(escapeOpener + escapeCloser, 'g'),
        interpolate : new RegExp(escapeOpener + '=' + escapeCloser, 'g'),
        escape      : new RegExp(escapeOpener + '-' + escapeCloser, 'g')
    };
}


function Template(core, options) {
    this.core = (typeof core !== 'undefined') ? core : {};
    this.options = (typeof options !== 'undefined') ? options : {};

    this._templateSettings = undefined;
    this._data = undefined;
};

_.extend(Template.prototype, {

    setTemplateVariable: function (opener, closer) {
        this._templateSettings = createTemplateVariableRule(opener, closer);

        return this;
    },

    toObject: function (addition) {
        this._init(addition);

        return this._replaceCycle(this.core);
    },

    get: function (key, addition) {
        this._init(addition);

        return this._getOneByKey(key);

        // var value = _.cloneDeep(this.core);

        // _.each(key.trim().split('.'), function (part) {
        //     if (typeof value !== 'undefined') {
        //         value = value[part];
        //     }
        // });

        // // return this._replaceCycle(value, create_data(this.core, addition));
        // return this._replaceCycle(value);
    },



    _init: function (addition) {
        this._data = create_data(this.core, addition);
    },


    _getOneByKey: function (key) {
        return this._replaceCycle( dot_access(this.core, key) );
    },

    _replaceCycle: function (value) {
        var _this_ = this;

        if (_.isString(value)) {
            return _this_._replace(value);
        }

        if (_.isArray(value) || _.isArguments(value)) {
            return _.map(value, function (v) {
                return _this_._replaceCycle(v);
            });
        }

        if (_.isObject(value)) {
            return _.assign({}, value, function (index, v) {
                return _this_._replaceCycle(v);
            });
        }

        return value;
    },

    _replace: function (value) {
        var _this_ = this;
        var data = this._data;

        var steps = [];
        var remaining = this.options.loop_limit || 0x7f;

        var originValue = value;
        var originTemplateSettings;

        while (value.indexOf('<%') >= 0) {
            remaining -= 1;

            var fullMatchKey = _this_._getFullVariableKey(value);

            if (fullMatchKey) {
                value = _this_._getOneByKey(fullMatchKey);

                if (_.isUndefined(value)) {
                    throw new ReferenceError(fullMatchKey + ' is not defined');
                }
            } else {
                value = _this_._template(value, data);
            }

            if (!_.isString(value)) {
                break;
            }

            if (originValue === value) {
                break;
            }

            if (_.contains(steps, value) || remaining < 1) {
                throw RangeError('a template string [' + value + '] is looped');
            }

            steps.push(value);
            originValue = value;
        };

        return value;
    },

    _template: function (value, data) {
        var replacing = !_.isUndefined(this._templateSettings);
        var originTemplateSettings;

        if (replacing) {
            originTemplateSettings = {
                escape:      _.templateSettings.escape,
                evaluate:    _.templateSettings.evaluate,
                interpolate: _.templateSettings.interpolate
            };

            _.templateSettings.escape      = this._templateSettings.escape;
            _.templateSettings.evaluate    = this._templateSettings.evaluate;
            _.templateSettings.interpolate = this._templateSettings.interpolate;
        }

        var result = _.template(value, data);

        if (replacing) {
            _.templateSettings.escape      = originTemplateSettings.escape;
            _.templateSettings.evaluate    = originTemplateSettings.evaluate;
            _.templateSettings.interpolate = originTemplateSettings.interpolate;
        }

        return result;
    },



    _getFullVariableKey: function (value) {
        var interpolate;

        if (_.isObject(this._templateSettings) && this._templateSettings.interpolate) {
            interpolate = this._templateSettings.interpolate;
        } else {
            interpolate = _.templateSettings.interpolate;
        }

        var full_interpolate_pattern = new RegExp('^' + interpolate.source + '$');
        var matches = value.match(full_interpolate_pattern);

        if (matches) {
            return matches[1].trim();
        } else {
            return null;
        }
    }
});


module.exports = function (core, addition) {
    return new Template(core, addition);
};
