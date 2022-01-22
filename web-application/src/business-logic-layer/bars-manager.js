
module.exports = function({barsRepository}){

    return {
        storeBarRunda: async (barRunda, account)=>{
            const result = await barsRepository.storeBarRunda(barRunda, account)
            return result
        }
    }
}