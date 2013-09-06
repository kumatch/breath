var _ = require('lodash');
var template = require('./template');
var dot_access = require('./dot_access');

module.exports = replaceCycle;

function extractFullVariableKeyName (string, setting) {
    var interpolate;

    if (setting.hasTemplateVariableRule()) {
        interpolate = setting.getTemplateVariableRule().interpolate;
    } else {
        interpolate = _.templateSettings.interpolate;
    }

    var full_interpolate_pattern = new RegExp('^' + interpolate.source + '$');
    var matches = string.match(full_interpolate_pattern);

    if (matches) {
        return matches[1].trim();
    } else {
        return null;
    }
}

function replaceString(string, dataObject, setting) {
    var origin = string;
    var value  = string;

    var steps = [];
    var remaining = setting.loop_limit;

    while (value.indexOf('<%') >= 0) {
        remaining -= 1;

        var fullMatchKey = extractFullVariableKeyName(value, setting);

        if (fullMatchKey) {
            value = replaceCycle( dot_access(dataObject, fullMatchKey), dataObject, setting);

            if (_.isUndefined(value)) {
                throw new ReferenceError(fullMatchKey + ' is not defined');
            }
        } else {
            value = template(value, dataObject, setting);
        }

        if (!_.isString(value)) {
            break;
        }

        if (origin === value) {
            break;
        }

        if (_.contains(steps, value) || remaining < 1) {
            throw RangeError('a template string [' + string + '] is looped');
        }

        steps.push(value);
        origin = value;
    };

    return value;
}


function replaceCycle(value, dataObject, setting) {
    if (_.isArray(value) || _.isArguments(value)) {
        return _.map(value, function (v) {
            return replaceCycle(v, dataObject, setting);
        });
    }

    if (_.isObject(value)) {
        return _.assign({}, value, function (index, v) {
            return replaceCycle(v, dataObject, setting);
        });
    }

    if (_.isString(value)) {
        return replaceString(value, dataObject, setting);
    } else {
        return value;
    }
}

