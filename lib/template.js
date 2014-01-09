var _ = require('lodash');

module.exports = function template (string, dataObject, setting) {
    return _.template(string, dataObject, setting.getTemplateVariableRule().template_options);


    // if (setting.hasTemplateVariableRule()) {
    //     var pattern = setting.getTemplateVariableRule().pattern;

    //     options = {
    //         escape:      pattern.escape,
    //         evaluate:    pattern.evaluate,
    //         interpolate: pattern.interpolate
    //     };
    // }

    // return _.template(string, dataObject, options);
};