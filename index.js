const rp = require('request-promise');

const {
    getAllUrls,
    extractHostname,
    REF_REGEX,
    findCommonElements
} = require('./utils');

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

async function check(links = [], spamLinkDomains = [], redirectionDepth = 1) {
    if (redirectionDepth === 0) {
        // check
        return findCommonElements(links.map(extractHostname), spamLinkDomains);
    } else {
        const links = await Promise.all(links.map(detectRedirect));
        const uniqueLinks = new Set(links);
        return check(
            Array.from(uniqueLinks),
            spamLinkDomains,
            redirectionDepth - 1
        );
    }
}

async function detectRedirect(link) {
    let result = [];
    let resp;
    try {
        resp = await rp({
            uri: link,
            followRedirect: false,
            resolveWithFullResponse: true
        });
        const statusCode = resp.statusCode;
        if (statusCode >= 200 && statusCode < 300) {
            result = result.concat(getAllUrls(resp.body, REF_REGEX));
        }
    } catch (e) {
        if (e.statusCode === 301) {
            result.push(e.response.headers.location);
        }
    }

    return result;
}
