var _ = require('lodash');
var nestraight = require('nestraight');

var create_data = require('./data');
var replace = require('./replace');
var setting = require('./setting');

var breath = {
    setTemplateVariableRule: function (opener, closer) {
        this.setting.setTemplateVariableRule(opener, closer);

        return this;
    },

    create: function (addition, callback) {
        if (arguments.length == 1 && _.isFunction(arguments[0])) {
            callback = arguments[0];
            addition = {};
        }

        var dataObject = create_data(this.core, addition);

        replace(this.core, dataObject, this.setting, callback);
    },

    createSync: function (addition) {
        var dataObject = create_data(this.core, addition);

            return replace(this.core, dataObject, this.setting);
    },

    get: function (key, addition, callback) {
        if (arguments.length == 2 && _.isFunction(arguments[1])) {
            callback = arguments[1];
            addition = {};
        }

        var dataObject = create_data(this.core, addition);
        var value = nestraight.get(this.core, key);

        if (callback) {
            return replace(value, dataObject, this.setting, callback);
        } else {
            return replace(value, dataObject, this.setting);
        }
    }
};

module.exports = function (core, options) {
    core = core || {};
    var config = setting(options);

    var breath = {
        setTemplateVariableRule: function (opener, closer) {
            config.setTemplateVariableRule(opener, closer);

            return this;
        },

        create: function (addition, callback) {
            if (arguments.length == 1 && _.isFunction(arguments[0])) {
                callback = arguments[0];
                addition = {};
            }

            var dataObject = create_data(core, addition);

            replace(core, dataObject, config, callback);
        },

        createSync: function (addition) {
            var dataObject = create_data(core, addition);

            return replace(core, dataObject, config);
        },

        get: function (key, addition, callback) {
            if (arguments.length == 2 && _.isFunction(arguments[1])) {
                callback = arguments[1];
                addition = {};
            }

            var dataObject = create_data(core, addition);
            var value = nestraight.get(core, key);

            if (callback) {
                return replace(value, dataObject, config, callback);
            } else {
                return replace(value, dataObject, config);
            }
        }
    };

    return breath;
};
