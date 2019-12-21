const rp = require('request-promise');

const { getAllUrls, extractHostname, REF_REGEX } = require('./utils');

/**
 *
 * @param {string} content
 * @param {array} spamLinkDomains
 * @param {number} redirectionDepth
 */
exports.isSpam = function isSpam(
    content,
    spamLinkDomains = [],
    redirectionDepth = 1
) {
    let result = false;
    const links = getAllUrls(content);
    if (links.length > 0) {
        result = check(links, spamLinkDomains, redirectionDepth);
    }

    return result;
};

function check(links = [], spamLinkDomains = [], redirectionDepth = 1) {
    if (redirectionDepth === 0) {
        // check
    } else {
    }
}

async function detectRedirect(link) {
    let result = [];
    const resp = await rp({
        uri: link,
        redirect: 'manual',
        resolveWithFullResponse: true
    });
    const statusCode = resp.statusCode;
    if (statusCode === 301) {
        result.push(resp.headers.get('location'));
    } else if (statusCode >= 200 && statusCode < 300) {
        result = result.concat(getAllUrls(resp.body, REF_REGEX));
    }
    return result;
}

detectRedirect('http://www.google.com/').then(console.log);
