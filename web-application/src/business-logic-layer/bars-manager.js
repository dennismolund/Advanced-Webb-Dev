
const { logBy } = require('../models/bar.model');
const { validParams, validRows, parseResult } = require('./bars-validator');

module.exports = ({ barsRepository }) => {

    const storeBarRunda = (barRunda, account, callback) => {
        if (!validParams('storeBarRunda', { barRunda, account })) {
            const e = new Error('Invalid Params');
            callback(e, null);
        } else {
            barsRepository.storeBarRunda(barRunda, account, callback)
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
                    try {
                        const parsed = parseResult(result[0].data);
                        const data = {
                            parsed,
                            raw: result[0],
                        }
                        callback(null, data);
                    } catch (e) {
                        //console.log(e);
                        callback(new Error('Failed to parse data'), null);
                    }
                }
            });
        }
    };

    const getBarrundaById = (id, callback) => {
        barsRepository.getBarrundaById(id, (error, result) => {
            callback(error, result);
        });
    }

    const deleteBarrundaById = (id, account, callback) => {
        getBarRunda(account, (error, result) => {
            if (error) callback(error, null);
            else {
                if (result.raw.owner !== account.id) {
                    console.log('User is not authroized to delete resource', result);
                    callback(['Unauthroized'], null);
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