
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
    console.log("pubcrawl:", pubcrawl);
    console.log("pubcrawl.length:", pubcrawl.length);
    console.log("pubcrawl[0]:", pubcrawl[0]);
    console.log("pubcrawl[0].data:", pubcrawl[0].data);
    
    return pubcrawl.length > 0 && pubcrawl[0] && pubcrawl[0].data;
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
    validateRows,
    parsePubcrawl,
}