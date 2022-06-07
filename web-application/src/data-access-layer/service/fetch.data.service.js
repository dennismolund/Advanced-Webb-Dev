const axios = require('axios');

const BarList = require('../../business-logic-layer/models/bar.model');

const API_KEY = 'AIzaSyDPwirw4Wvb4y4vDRGUgAsx5yEcSfQR08Q';
const NEARBY_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const path = 'location=57.78261370000001,14.1617876&radius=1500&types=bar&key=AIzaSyDPwirw4Wvb4y4vDRGUgAsx5yEcSfQR08Q';


const getPlaces = async () => {
    let res = [];

    try {
        const url = NEARBY_SEARCH_URL.concat(path, '&key', API_KEY);
        const response = await axios.get(url);
        res = BarList.aggregate(response.data.results);
    } catch (e) {
        console.log('Got error');
        if (e.response && e.response.data) console.log(e.response.data);
        else console.log(e.message);
    }
    return res;
}

module.exports = {
    getPlaces
}