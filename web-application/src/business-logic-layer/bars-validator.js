
const validParams = (fName, paramsObj) => {
    Object.keys(paramsObj).forEach((key) => {
        if (!paramsObj[key]) {
            console.log('Missing value for param', key, 'when running', fName);
            return false;
        } 
    });
    return true;
}

const validRows = (result) => {
    return result.length > 0 && result[0] && result[0].data;
}

const parseResult = (result) => {
    return JSON.parse(result);
}

module.exports = {
    validParams,
    validRows,
    parseResult,
}