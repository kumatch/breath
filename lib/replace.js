var _ = require('lodash');
var async = require('async');
var nestraight = require('nestraight');

var template = require('./template');

module.exports = replaceCycle;

function isThroughValue(value) {
    if (_.isBoolean(value)) return true;
    if (_.isDate(value)) return true;
    if (_.isFunction(value)) return true;
    if (_.isNaN(value)) return true;
    if (_.isNull(value)) return true;
    if (_.isNumber(value)) return true;
    if (_.isRegExp(value)) return true;
    if (_.isUndefined(value)) return true;

    return false;
}



function extractFullVariableKeyName (string, setting) {
    var interpolate;

    if (setting.hasTemplateVariableRule()) {
        interpolate = setting.getTemplateVariableRule().pattern.interpolate;
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
    var opener;


    if (setting.hasTemplateVariableRule()) {
        opener = setting.getTemplateVariableRule().opener;
    } else {
        opener = '<%';
    }


    while (value.indexOf(opener) >= 0) {
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

    if (isThroughValue(value)) {
        return value;
    }

    if (_.isArray(value) || _.isArguments(value)) {
        return _.map(value, function (v) {
            return replaceCycleSync(v, dataObject, setting);
        });
    }

    if (_.isObject(value)) {
        // var obj = {};
        // _.each(value, function (v, k) {
        //     var r = replaceCycleSync(v, dataObject, setting);
        //     obj[k] = r;
        // });

        // return obj;
        return _.assign({}, value, function (index, v) {
            return replaceCycleSync(v, dataObject, setting);
        });
    }


    if (_.isString(value)) {
        return replaceString(value, dataObject, setting);
    }

    return value;
}



function replaceCycleAsync(value, dataObject, setting, callback) {
    var result;

    if (isThroughValue(value)) {
        callback(null, value);
        return;
    }

    if (_.isArray(value) || _.isArguments(value)) {
        async.map(value, function (v, next) {
            replaceCycleAsync(v, dataObject, setting, next);
        }, callback);

        return;
    }

    if (_.isObject(value)) {
        var keys = Object.keys(value);
        var results = {};

        async.each(keys, function (k, next) {
            var v = value[k];

            replaceCycleAsync(v, dataObject, setting, function (err, r) {
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

