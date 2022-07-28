
const {
    validatePubcrawl,
    parsePubcrawl
} = require('./pubcrawl-validator');
const ERROR_ENUM = require('./models/error_enum');


module.exports = ({ barsRepository }) => {

    const storePubcrawl = (pubcrawl, userId, callback) => {
        if (!validatePubcrawl('storePubcrawl', pubcrawl)) {
            const e = new Error('Invalid Params');
            callback(e, null);
        } else {
            barsRepository.storePubcrawl(pubcrawl, userId, callback);
        }
    };
    

    const getPubcrawl = (account, callback) => {
        if (!validatePubcrawl('getPubcrawl', {account})) {
            const e = new Error('Invalid Params');
            callback(e, null);
        } else {
            barsRepository.getPubcrawl(account, (error, pubcrawl) => {

                if (error) {
                    callback(error, null);
                } else {
                    if (!pubcrawl) {
                        callback(ERROR_ENUM.NO_PUBCRAWL_FOR_ACCOUNT, null);
                        return;
                    }
                    try {
                        const parsed = parsePubcrawl(pubcrawl.pub_list);
                        const data = {
                            parsed,
                            raw: pubcrawl,
                        }
                        callback(null, data);
                    } catch (e) {
                        console.log(e);
                        callback(ERROR_ENUM.SERVER_ERROR, null);
                    }
                }   
            });
        }
    };

    const deletePubcrawlById = (id, account, callback) => {
        getPubcrawl(account, (error, pubcrawl) => {
            if (error) {
                callback(error, null);
            } else {
                if (pubcrawl.raw.owner_id !== account.id) {
                    callback(ERROR_ENUM.UNAUTHORIZED, null);
                } else {
                    barsRepository.deletePubcrawlById(id, (error, result) => {
                        if (error) {
                            callback(error, null);
                        } else {
                            console.log('successfully deleted pubcrawl');
                            callback(null, 'success');
                        }
                    });
                }
            }
        });
    }

    const getPubcrawlById = (id, callback) => {
        barsRepository.getPubcrawlById(id, (error, pubcrawl) => {
            if (error) {
                callback(error, null);
            } else if (!pubcrawl) {
                callback(null, null);
            } else {
                try {
                    const parsed = parsePubcrawl(pubcrawl.pub_list);
                    const data = {
                        parsed,
                        raw: pubcrawl,
                    }
                    callback(null, data);
                } catch (e) {
                    console.log(e);
                    callback(ERROR_ENUM.SERVER_ERROR, null);
                }
            }
        });
    }    

    const updatePubcrawl = (id, account, newPubcrawlData, callback) => {
        getPubcrawlById(id, (error, pubcrawl) => {
            let id;
            if (error) {
                callback(error, null);
                return;
            }

            if (!pubcrawl) {
                callback(ERROR_ENUM.PUBCRAWL_NOT_FOUND, null);
                return;
            }

            if (pubcrawl.raw.owner_id !== account.id) {
                callback(ERROR_ENUM.MUST_BE_OWNER, null);
                return;
            }

            id = pubcrawl.raw.id;

            barsRepository.updatePubcrawlById(
                id,
                newPubcrawlData,
                (error, result) => {
                    if (error) {
                        console.log(error);
                        callback(ERROR_ENUM.SERVER_ERROR, null);
                        return;
                    }
                    callback(null, { id });
                }
            );
        });
    }


    return {
        storePubcrawl,
        getPubcrawl,
        deletePubcrawlById,
        getPubcrawlById,
        updatePubcrawl,
    }
}