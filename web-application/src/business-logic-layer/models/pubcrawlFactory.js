const scrambleArray = require('../helpFunctions')
class PubTemplate {
    constructor(pub) {
        this.raw = pub;
        this.name = pub.name;
        this.vicinity = pub.vicinity;
        this.rating = pub.rating;
        this.tot_rating = pub.user_rating_total;
        this.price_level = pub.price_level;
        this.types = pub.types;
    }
}
class Pubcrawl {
    constructor() {
        this.list = [];
    }
    //pubs retrieved from Google API
    aggregate(rawPubs) {
        rawPubs.forEach((pubItem) => {
            const pub = new PubTemplate(pubItem)
            this.list.push(pub);
        });
        return this;
    }

    logBy(prop) {
        this.list.forEach((item) => {
        })
    }

    getRandom(amount) {
        const max = amount || 5;
        let pickFrom = Array.from(this.list);
        let res = [];
        // If we try to make bigger list than we have, we return what we have in scrambled order.
        if (max > this.list.length) return scrambleArray(this.list);

        for (let i = 0; i < max; i++) {
            const item = pickFrom[Math.floor(Math.random() * pickFrom.length)];
            res.push(item);

            const remove_ix = pickFrom.indexOf(item);
            pickFrom.splice(remove_ix, 1);
        }
        const a = res.map((item) => item.name);
        return new Pubcrawl().aggregate(res);
    }
}

module.exports = new Pubcrawl();