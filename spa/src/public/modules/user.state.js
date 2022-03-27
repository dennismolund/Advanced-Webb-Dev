import AjaxClient from './api.js';

class User {
    constructor() {
        this.barrundaid = null;
        this.username = null;
        this.teamid = null;
        this.id = null;
        this.token = null;
        this.signedIn = false;
        this.barList = [];
    }

    init(pack) {
        const { barrundaid, id, teamid, username } = pack.account;
        this.token = pack.idToken ? pack.idToken : this.token;
        this.barrundaid = barrundaid;
        this.id = id;
        this.teamid = teamid;
        this.username = username;
        // localStorage.setItem('accessToken', this.token);
        this.signedIn = true;
    }

    logout() {
        this.barrundaid = null;
        this.username = null;
        this.teamid = null;
        this.id = null;
        this.token = null;
        this.signedIn = false;
        this.barList = [];
    }

    async loadData() {
        if (!this.barrundaid) return;
        const { data } = await AjaxClient.get(`http://localhost:3002/api/bars/${this.barrundaid}`);
        if (data?.parsed?.list) {
            this.barList = data.parsed.list;
        }
    }

    setBarList(data) {
        const { barrunda: list, id } = data;
        this.barrundaid = id;
        this.barList = list || [];
    }

    hasBarrunda() {
        return !!this.barrundaid;
    }

    isSignedIn() {
        if (!localStorage.accessToken) {
            this.signedIn = false;
        }
        return this.signedIn;
    }
}

export default new User();
