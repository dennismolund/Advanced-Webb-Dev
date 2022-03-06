
const validParams = (fName, paramsObj) => {
    let valid = true;
    Object.keys(paramsObj).forEach((key) => {
        if (!paramsObj[key]) {
            console.log('Missing value for param', key, 'when running', fName);
            valid = false;
        } 
    });
    return valid;
}

const validRows = (result) => {
    console.log(result.length > 0);
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