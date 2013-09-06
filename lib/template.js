var _ = require('lodash');

module.exports = function template (string, dataObject, setting) {
    var originTemplateSetting;

    if (setting.variable_pattern) {
        originTemplateSetting = {
            escape:      _.templateSettings.escape,
            evaluate:    _.templateSettings.evaluate,
            interpolate: _.templateSettings.interpolate
        };

        _.templateSettings.escape      = setting.variable_pattern.escape;
        _.templateSettings.evaluate    = setting.variable_pattern.evaluate;
        _.templateSettings.interpolate = setting.variable_pattern.interpolate;
    }

    var result = _.template(string, dataObject);

    if (originTemplateSetting) {
        _.templateSettings.escape      = originTemplateSetting.escape;
        _.templateSettings.evaluate    = originTemplateSetting.evaluate;
        _.templateSettings.interpolate = originTemplateSetting.interpolate;
    }

    return result;
};