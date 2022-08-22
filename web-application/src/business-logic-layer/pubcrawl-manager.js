
const {
    validatePubcrawl,
    parsePubcrawl
} = require('./pubcrawl-validator');
const ERROR_ENUM = require('./models/error_enum');
const Pubcrawl = require('.//models/pubcrawlFactory')
const {
    getPubsFromGoogleAPI
} = require('./service/fetch.data.service');

module.exports = ({ pubcrawlRepository }) => {
    
    const createPubcrawl = async () => {
        await getPubsFromGoogleAPI();
        const pubcrawl = Pubcrawl.getRandom();
        return pubcrawl
    }

    const storePubcrawl = (pubcrawl, account_id, callback) => {
        //account_id is derived from an active session. Checks if an account is logged in.
        if(!account_id) callback(ERROR_ENUM.AUTHORIZATION_FAIL, null);

        if (!validatePubcrawl('storePubcrawl', pubcrawl)) {
            const e = new Error(ERROR_ENUM.INVALID_PUBCRAWL);
            callback(e, null);
        } else {
            pubcrawlRepository.storePubcrawl(pubcrawl, account_id, callback);
        }
    };
    

    const getPubcrawl = (activeAccount, callback) => {
        //Checks if an account is logged in.
        if(!activeAccount) callback(ERROR_ENUM.AUTHORIZATION_FAIL, null);

        pubcrawlRepository.getPubcrawl(activeAccount, (error, pubcrawl) => {
            if (error) {
                callback(error, null);
            } else {
                if (!pubcrawl) {
                    callback(ERROR_ENUM.NO_PUBCRAWL_FOR_ACCOUNT, null);
                    return;
                }

                if (pubcrawl.owner_id !== activeAccount.id) {
                    callback(ERROR_ENUM.AUTHORIZATION_FAIL, null);
                }
                try {
                    const parsed = parsePubcrawl(pubcrawl.pub_list);
                    const data = {
                        parsed,
                        raw: pubcrawl,
                    }
                    callback(null, data);
                } catch (e) {
                    callback(ERROR_ENUM.SERVER_ERROR, null);
                }
            }   
        });
        
    };

    const deletePubcrawlById = (pubcrawl_id, activeAccount, callback) => {
        getPubcrawl(activeAccount, (error, pubcrawl) => {
            if (error) {
                callback(error, null);
            } else {
                //Check if the owner_id of the pubcrawl that is being delete has the same account id as the current logged in user.
                if (pubcrawl.raw.owner_id !== activeAccount.id) {
                    callback(ERROR_ENUM.UNAUTHORIZED, null);
                } else {
                    pubcrawlRepository.deletePubcrawlById(pubcrawl_id, (error, result) => {
                        if (error) {
                            callback(error, null);
                        } else {
                            callback(null, 'success');
                        }
                    });
                }
            }
        });
    }

    const getPubcrawlById = (activeAccount, id, callback) => {
        //Checks if an account is logged in.
        if(!activeAccount) callback(ERROR_ENUM.AUTHORIZATION_FAIL, null);
        pubcrawlRepository.getPubcrawlById(id, (error, pubcrawl) => {
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
                    if (pubcrawl.owner_id !== activeAccount.id) {
                        callback(ERROR_ENUM.UNAUTHORIZED, null);
                    }else callback(null, data);
                } catch (e) {
                    callback(ERROR_ENUM.SERVER_ERROR, null);
                }
            }
        });
    }    

    const updatePubcrawl = (id, activeAccount, newPubcrawlData, callback) => {
        getPubcrawlById(activeAccount, id, (error, pubcrawl) => {
            let id;
            if (error) {
                callback(error, null);
                return;
            }

            if (!pubcrawl) {
                callback(ERROR_ENUM.PUBCRAWL_NOT_FOUND, null);
                return;
            }

            if (pubcrawl.raw.owner_id !== activeAccount.id) {
                callback(ERROR_ENUM.MUST_BE_OWNER, null);
                return;
            }

            id = pubcrawl.raw.id;

            pubcrawlRepository.updatePubcrawlById(
                id,
                newPubcrawlData,
                (error, result) => {
                    if (error) {
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
        createPubcrawl
    }
}