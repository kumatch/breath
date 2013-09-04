var _ = require('lodash');

module.exports = function (object, key) {
    key = (typeof key === 'string') ? String(key).trim() : "";

    key = key.replace(/\[[\s]*["']?[\s]*([\w]+)[\s]*["']?[\s]*\]/g, '.$1')
        .replace(/^[\.]*/, '')
        .replace(/[\.]*$/, '');

    var value = object;

    _.each(key.split('.'), function (k) {
        value = value[k];
    });

    return value;
};