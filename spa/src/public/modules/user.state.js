import parseJwt from './helpers.js';
import AjaxClient from './api.js';

class User {
    constructor() {
        this.pubcrawl_id = null;
        this.username = null;
        this.team_id = null;
        this.id = null;
        this.token = null;
        this.signedIn = false;
        this.pubList = [];
    }

    init(pack) {
        const { user } = parseJwt(pack.access_token);
        const { pubcrawl_id, id, team_id, username } = user;
        this.token = pack.access_token ? pack.access_token : this.token;
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
        this.pubList = [];
        localStorage.removeItem('accessToken');
    }

    async loadData() {
        if (!this.pubcrawl_id) return;
        const { data } = await AjaxClient.get(`http://localhost:3002/api/pubcrawl/${this.pubcrawl_id}`);
        if (data?.parsed?.list) {
            this.pubList = data.parsed.list;
        }
    }

    setPubs(data) {
        const { pubcrawl: list, id } = data;
        this.pubcrawl_id = id;
        this.pubList = list || [];
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
