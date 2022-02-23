
const { validParams, validRows, parseResult } = require('./bars-validator');

module.exports = function({ barsRepository }){

    return {
        storeBarRunda: (barRunda, account, callback) => {
            if (!validParams('storeBarRunda', { barRunda, account })) {
                const e = new Error('Invalid Params');
                callback(e, null);
            } else {


                barsRepository.storeBarRunda(barRunda, account, callback)
            }
        },

        getBarRunda: (account, callback) => {
            if (!validParams('getBarRunda', {account})) {
                const e = new Error('Invalid Params');
                callback(e, null);
            } else {
                barsRepository.getBarRunda(account, (error, result) => {

                    if (error) callback(error, null);
                    else if (!validRows(result)) callback(null, null);
                    else {
                        try {
                            //console.log(result[0]);
                            const parsed = parseResult(result[0].data);
                            callback(null, parsed);
                        } catch (e) {
                            //console.log(e);
                            callback(new Error('Failed to parse data'), null);
                        }
                    }
                });
            }
        }
    }
}