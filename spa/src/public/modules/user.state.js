import AjaxClient from './api.js';

class User {
    constructor() {
        this.pubcrawl_id = null;
        this.username = null;
        this.team_id = null;
        this.id = null;
        this.token = null;
        this.signedIn = false;
        this.barList = [];
    }

    init(pack) {
        const { pubcrawl_id, id, team_id, username } = pack.account;
        this.token = pack.idToken ? pack.idToken : this.token;
        this.pubcrawl_id = pubcrawl_id;
        this.id = id;
        this.team_id = team_id;
        this.username = username;
        localStorage.setItem('accessToken', this.token);
        this.signedIn = true;
    }

    logout() {
        this.pubcrawl_id = null;
        this.username = null;
        this.team_id = null;
        this.id = null;
        this.token = null;
        this.signedIn = false;
        this.barList = [];
    }

    async loadData() {
        if (!this.pubcrawl_id) return;
        const { data } = await AjaxClient.get(`http://localhost:3002/api/bars/${this.pubcrawl_id}`);
        if (data?.parsed?.list) {
            this.barList = data.parsed.list;
        }
    }

    setBars(data) {
        const { pubcrawl: list, id } = data;
        this.pubcrawl_id = id;
        this.barList = list || [];
    }

    hasPubcrawl() {
        return !!this.pubcrawl_id;
    }

    isSignedIn() {
        if (!localStorage.accessToken) {
            this.signedIn = false;
        }
        return this.signedIn;
    }
}

export default new User();
