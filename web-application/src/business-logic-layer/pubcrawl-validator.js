
const validatePubcrawl = (fName, pubcrawl) => {
    Object.keys(pubcrawl).forEach((key) => {
        if (!pubcrawl[key]) {
            console.log('Missing value for param', key, 'when running', fName);
            return false;
        } 
    });
    return true;
}

const validateRows = (pubcrawl) => {
    return pubcrawl.length > 0 && pubcrawl[0] && pubcrawl[0].data;
}

const parsePubcrawl = (pubcrawl) => {
    if (typeof pubcrawl === 'object') return pubcrawl;
    return JSON.parse(pubcrawl);
}

module.exports = {
    validatePubcrawl,
    validateRows,
    parsePubcrawl,
}