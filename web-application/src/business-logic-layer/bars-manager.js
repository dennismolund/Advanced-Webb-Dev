
const { logBy } = require('./models/pubcrawlFactory');
const { validParams, validRows, parseResult } = require('./bars-validator');
const ERROR_ENUM = require('./models/error_enum');

module.exports = ({ barsRepository }) => {

    const storePubcrawl = (pubcrawl, userId, callback) => {
        if (!validParams('storePubcrawl', pubcrawl)) {
            const e = new Error('Invalid Params');
            callback(e, null);
        } else {
            barsRepository.storePubcrawl(pubcrawl, userId, callback)
        }
    };
    

    const getPubcrawl = (account, callback) => {
        if (!validParams('getPubcrawl', {account})) {
            const e = new Error('Invalid Params');
            callback(e, null);
        } else {
            barsRepository.getPubcrawl(account, (error, result) => {

                if (error) callback(error, null);
                else {
                    if (!result) {
                        callback('Found no pubcrawl for account', null);
                        return;
                    }
                    try {
                        const parsed = parseResult(result.data);
                        const data = {
                            parsed,
                            raw: result,
                        }
                        callback(null, data);
                    } catch (e) {
                        console.log(e);
                        callback('Failed to parse data', null);
                    }
                }
            });
        }
    };

    const getPubcrawlById = (id, callback) => {
        barsRepository.getPubcrawlById(id, (error, result) => {
            if (error) {
                callback(error, null);
            } else if (!result) {
                callback(null, null);
            } else {
                try {
                    const parsed = parseResult(result.data);
                    const data = {
                        parsed,
                        raw: result,
                    }
                    callback(null, data);
                } catch (e) {
                    console.log(e);
                    callback(new Error('Failed to parse data'), null);
                }
            }
        });
    }

    const deletePubcrawlById = (id, account, callback) => {
        getPubcrawl(account, (error, result) => {
            if (error) callback(error, null);
            else {
                if (result.raw.owner_id !== account.id) {
                    console.log('User is not authroized to delete resource', result);
                    callback(ERROR_ENUM.UNAUTHORIZED, null);
                } else {
                    barsRepository.deletePubcrawlById(id, (error, result) => {
                        if (error) callback(error, null);
                        else {
                            console.log('successfully deleted pubcrawl');
                            callback(null, 'success');
                        }
                    });
                }
            }
        });

    }

    return {
        storePubcrawl,
        getPubcrawl,
        deletePubcrawlById,
        getPubcrawlById,
    }
}