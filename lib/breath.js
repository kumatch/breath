var _ = require('lodash');

var create_data = require('./data');
var replace = require('./replace');
var dot_access = require('./dot_access');
var setting = require('./setting');

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


function Breath(core, options) {
    this.core = (typeof core !== 'undefined') ? core : {};
    this.setting = setting(options);
};

_.extend(Breath.prototype, {

    setTemplateVariableRule: function (opener, closer) {
        this.setting.setTemplateVariableRule(opener, closer);

        return this;
    },

    toObject: function (addition) {
        var dataObject = create_data(this.core, addition);

        return replace(this.core, dataObject, this.setting);
    },

    get: function (key, addition) {
        var dataObject = create_data(this.core, addition);
        var value = dot_access(this.core, key);

        return replace(value, dataObject, this.setting);
    }
});

module.exports = function (core, addition) {
    return new Breath(core, addition);
};
