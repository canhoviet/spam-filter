const URL_REGEX = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
const REF_REGEX = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi;

exports.getAllUrls = function getAllUrls(input = '', pattern = URL_REGEX) {
    const matches = input.match(pattern);
    const result = [];
    for (match in matches) {
        result.push(matches[match]);
    }
    return result;
};

exports.extractHostname = function extractHostname(url) {
    let hostname;
    if (url.indexOf('//') > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
};

exports.findCommonElements = function findCommonElements(arr1, arr2) {
    return arr1.some(item => arr2.includes(item));
};
exports.REF_REGEX = REF_REGEX;
