var _ = require('lodash');

function Setting (options) {
    this.loop_limit = options.loop_limit || 0x7f;
    this.only_interpolation = options.only_interpolation ? true : false;

    var opener = options.opener || '<%';
    var closer = options.closer || '%>';

    this.setTemplateVariableRule(opener, closer);
}

Setting.prototype = {

    setTemplateVariableRule: function (opener, closer) {
        var VARIABLE_NAME_PATTERN = '([\\s\\S]+?)';

        var escapeOpener = opener.replace(/(.)/g, '\\$1');
        var escapeCloser = VARIABLE_NAME_PATTERN + closer.replace(/(.)/g, '\\$1');

        var evaluateRule    = RegExp(escapeOpener + escapeCloser, 'g');
        var escapeRule      = RegExp(escapeOpener + '-' + escapeCloser, 'g');
        var interpolateRule = RegExp(escapeOpener + '=' + escapeCloser, 'g');
        var interpolateOnlyRule = RegExp(escapeOpener + '[=|-]?' + escapeCloser, 'g');

        this.variable_rule = {
            opener: opener,
            closer: closer,

            template_options: {
                evaluate    : this.only_interpolation ? undefined : evaluateRule,
                escape      : this.only_interpolation ? undefined : escapeRule,
                interpolate : this.only_interpolation ? interpolateOnlyRule : interpolateRule
            }
        };
    },

    getTemplateVariableRule: function () {
        return this.variable_rule;
    }
};

module.exports = function (options) {
    options = options || {};

    return new Setting(options);
};