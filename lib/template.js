var _ = require('lodash');

module.exports = function template (string, dataObject, setting) {
    var originPattern;

    if (setting.hasTemplateVariableRule()) {
        originPattern = {
            escape:      _.templateSettings.escape,
            evaluate:    _.templateSettings.evaluate,
            interpolate: _.templateSettings.interpolate
        };

        var pattern = setting.getTemplateVariableRule().pattern;

        _.templateSettings.escape      = pattern.escape;
        _.templateSettings.evaluate    = pattern.evaluate;
        _.templateSettings.interpolate = pattern.interpolate;
    }


    var result = _.template(string, dataObject);


    if (originPattern) {
        _.templateSettings.escape      = originPattern.escape;
        _.templateSettings.evaluate    = originPattern.evaluate;
        _.templateSettings.interpolate = originPattern.interpolate;
    }

    return result;
};