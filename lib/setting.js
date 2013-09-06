var _ = require('lodash');

function Setting (options) {
    this.loop_limit = options.loop_limit || 0x7f;
    this.variable_pattern = undefined;
}

_.extend(Setting.prototype, {

    setTemplateVariableRule: function (opener, closer) {
        var VARIABLE_NAME_PATTERN = '([\\s\\S]+?)';

        var escapeOpener = opener.replace(/(.)/g, '\\$1');
        var escapeCloser = VARIABLE_NAME_PATTERN + closer.replace(/(.)/g, '\\$1');

        this.variable_pattern = {
            evaluate    : new RegExp(escapeOpener + escapeCloser, 'g'),
            interpolate : new RegExp(escapeOpener + '=' + escapeCloser, 'g'),
            escape      : new RegExp(escapeOpener + '-' + escapeCloser, 'g')
        };
    },

    getTemplateVariableRule: function () {
        return this.variable_pattern;
    },

    hasTemplateVariableRule: function () {
        return (!_.isUndefined(this.variable_pattern)) ? true : false;
    }
});

module.exports = function (options) {
    options = options || {};

    return new Setting(options);
};