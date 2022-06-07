
const { logBy } = require('./models/bar.model');
const { validParams, validRows, parseResult } = require('./bars-validator');
const ERROR_ENUM = require('./models/error.enum');

module.exports = ({ barsRepository }) => {

    const storeBarRunda = (barRunda, userId, callback) => {
        if (!validParams('storeBarRunda', barRunda)) {
            const e = new Error('Invalid Params');
            callback(e, null);
        } else {
            barsRepository.storeBarRunda(barRunda, userId, callback)
        }
    };
    

    const getBarRunda = (account, callback) => {
        if (!validParams('getBarRunda', {account})) {
            const e = new Error('Invalid Params');
            callback(e, null);
        } else {
            barsRepository.getBarRunda(account, (error, result) => {

                if (error) callback(error, null);
                else {
                    if (!result) {
                        callback('Found no barrunda for account', null);
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

    const getBarrundaById = (id, callback) => {
        barsRepository.getBarrundaById(id, (error, result) => {
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

    const deleteBarrundaById = (id, account, callback) => {
        getBarRunda(account, (error, result) => {
            if (error) callback(error, null);
            else {
                if (result.raw.owner_id !== account.id) {
                    console.log('User is not authroized to delete resource', result);
                    callback(ERROR_ENUM.UNAUTHORIZED, null);
                } else {
                    barsRepository.deleteBarrundaById(id, (error, result) => {
                        if (error) callback(error, null);
                        else {
                            console.log('successfully deleted barrunda');
                            callback(null, 'success');
                        }
                    });
                }
            }
        });

    }

    return {
        storeBarRunda,
        getBarRunda,
        deleteBarrundaById,
        getBarrundaById,
    }
}