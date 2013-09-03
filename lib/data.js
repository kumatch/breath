var _ = require('lodash');

module.exports = function (core, addition) {
    if (typeof core === 'undefined') core = {};
    if (typeof addition === 'undefined') addition = {};

    var data = _.cloneDeep(core);

    return _.merge(data, addition);
};