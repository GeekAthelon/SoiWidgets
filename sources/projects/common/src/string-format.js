function stringFormat(str, col) {
    'use strict';

    /// <summary>Format a string use parameter substitution</summary>
    /// <param name="str" type="String">The string to format</param>
    /// <param name="col" type="String" parameterArray="true">
    ///   Value for {n}<br />Or an object containing key/value pairs
    /// </param>
    /// <returns type="String">The formatted string</returns>

    let col1 = typeof col === 'object' ? col : Array.prototype.slice.call(
        arguments, 1);

    return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function(m, n) {
        if (m === '{{') {
            return '{';
        }
        if (m === '}}') {
            return '}';
        }
        return col1[n];
    });
}

exports = module.exports = stringFormat;
