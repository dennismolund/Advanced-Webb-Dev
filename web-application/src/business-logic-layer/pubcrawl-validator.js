
const validatePubcrawl = (fName, pubcrawl) => {
    Object.keys(pubcrawl).forEach((key) => {
        if (!pubcrawl[key]) {
            return false;
        } 
    });
    return true;
}

const parsePubcrawl = (pubcrawl) => {
    let response = pubcrawl;
    if (typeof pubcrawl === 'object') return pubcrawl;
    response = JSON.parse(pubcrawl);
    if(typeof response === 'string') response = JSON.parse(response);
    return response
}

module.exports = {
    validatePubcrawl,
    parsePubcrawl,
}