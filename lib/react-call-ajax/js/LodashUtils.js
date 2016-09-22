"use strict";

// Functions taken from lodash 4.5.1 to keep backward compatibility for old projects
var LodashUtils = {
    chunk: function chunk(array, size) {
        var length = array ? array.length : 0;
        if (!length || size < 1) {
            return [];
        }
        var index = 0,
            resIndex = -1,
            result = new Array(Math.ceil(length / size));

        while (index < length) {
            result[++resIndex] = array.slice(index, index += size);
        }
        return result;
    }
};

module.exports = LodashUtils;