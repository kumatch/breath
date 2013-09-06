var _ = require('lodash');
var async = require('async');
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


function replaceCycle(value, dataObject, setting, callback) {
    var result;

    if (_.isArray(value) || _.isArguments(value)) {
        if (callback) {
            async.map(value, function (v, next) {
                replaceCycle(v, dataObject, setting, next);
            }, callback);

            return null;
        } else {
            return _.map(value, function (v) {
                return replaceCycle(v, dataObject, setting);
            });
        }
    }


    if (_.isObject(value)) {
        if (callback) {
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
        } else {
            return _.assign({}, value, function (index, v) {
                return replaceCycle(v, dataObject, setting);
            });
        }
    }


    if (_.isString(value)) {
        try {
            result = replaceString(value, dataObject, setting);

            if (callback) {
                callback(null, result);
            } else {
                return result;
            }
        } catch (e) {
            if (callback) {
                callback(e);
            } else {
                throw e;
            }
        }
    } else {
        if (callback) {
            callback(null, value);
        } else {
            return value;
        }
    }
}

