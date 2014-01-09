var _ = require('lodash');

function Setting (options) {
    this.loop_limit = options.loop_limit || 0x7f;
    this.variable = undefined;
}

Setting.prototype = {

    setTemplateVariableRule: function (opener, closer) {
        var VARIABLE_NAME_PATTERN = '([\\s\\S]+?)';

        var escapeOpener = opener.replace(/(.)/g, '\\$1');
        var escapeCloser = VARIABLE_NAME_PATTERN + closer.replace(/(.)/g, '\\$1');

        this.variable = {
            opener: opener,
            closer: closer,

            pattern: {
                evaluate    : new RegExp(escapeOpener + escapeCloser, 'g'),
                interpolate : new RegExp(escapeOpener + '=' + escapeCloser, 'g'),
                escape      : new RegExp(escapeOpener + '-' + escapeCloser, 'g')
            }
        };
    },

    getTemplateVariableRule: function () {
        return this.variable;
    },

    hasTemplateVariableRule: function () {
        return (!_.isUndefined(this.variable)) ? true : false;
    }
};

module.exports = function (options) {
    options = options || {};

    return new Setting(options);
};