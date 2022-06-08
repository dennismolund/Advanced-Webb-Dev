class Bars {
    constructor() {
        this.list = [];
    }

    //bars retrieved from Google API
    aggregate(bars) {
        bars.forEach((bar_item) => {
            const bar = new Bar(bar_item)
            this.list.push(bar);
        });
        return this;
    }

    logBy(prop) {
        this.list.forEach((item) => {
            console.log('Bar: ', item[prop]);
        })
    }

    static scramble(array) {
        let currentIndex = array.length,  randomIndex;

        while (currentIndex != 0) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    getRandom(_amount) {
        const max = _amount || 5;
        let pickFrom = Array.from(this.list);
        let res = [];
        // If we try to make bigger list than we have, we return what we have in scrambled order.
        if (max > this.list.length) return Bars.scramble(this.list);

        for (let i = 0; i < max; i++) {
            const item = pickFrom[Math.floor(Math.random() * pickFrom.length)];
            res.push(item);

            const remove_ix = pickFrom.indexOf(item);
            pickFrom.splice(remove_ix, 1);
        }
        const a = res.map((item) => item.name);
        return new Bars().aggregate(res);
    }
}

class Bar {
    constructor(bar) {
        this.raw = bar;
        this.name = bar.name;
        this.vicinity = bar.vicinity;
        this.rating = bar.rating;
        this.tot_rating = bar.user_rating_total;
        this.price_level = bar.price_level;
        this.types = bar.types;
    }
}

module.exports = new Bars();