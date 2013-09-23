var _ = require('lodash');
var async = require('async');
var nestraight = require('nestraight');

var template = require('./template');

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
            value = replaceCycle( nestraight.get(dataObject, fullMatchKey), dataObject, setting);

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


function replaceCycle(value, dataObject, setting, callback) {
    if (_.isFunction(callback)) {
        return replaceCycleAsync(value, dataObject, setting, callback);
    } else {
        return replaceCycleSync(value, dataObject, setting);
    }
}


function replaceCycleSync(value, dataObject, setting) {
    var result;

    if (_.isArray(value) || _.isArguments(value)) {
        return _.map(value, function (v) {
            return replaceCycle(v, dataObject, setting);
        });
    }


    if (_.isPlainObject(value)) {
        return _.assign({}, value, function (index, v) {
            return replaceCycle(v, dataObject, setting);
        });
    }


    if (_.isString(value)) {
        return replaceString(value, dataObject, setting);
    }

    return value;
}



function replaceCycleAsync(value, dataObject, setting, callback) {
    var result;

    if (_.isArray(value) || _.isArguments(value)) {
        async.map(value, function (v, next) {
            replaceCycle(v, dataObject, setting, next);
        }, callback);

        return;
    }


    if (_.isPlainObject(value)) {
        var keys = Object.keys(value);
        var results = {};

        async.each(keys, function (k, next) {
            var v = value[k];

            replaceCycle(v, dataObject, setting, function (err, r) {
                if (err) {
                    next(err);
                } else {
                    results[k] = r;
                    next();
                }
            });
        }, function (err) {
            if (err) {
                callback(err);
            } else {
                callback(null, results);
            }
        });

        return;
    }


    if (_.isString(value)) {
        try {
            result = replaceString(value, dataObject, setting);
            callback(null, result);
        } catch (e) {
            callback(e);
        }

        return;
    }

    return callback(null, value);
}

