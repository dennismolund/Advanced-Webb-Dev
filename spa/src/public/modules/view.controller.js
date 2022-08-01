import View from './view.js';
import Account from './account.state.js';
class ViewController {
    constructor(){
        this.activeView = null;
        this.views = null;
    }

    setViewList() {
        const htmlViews = document.querySelectorAll('.view');
        const a = Array.from(htmlViews);
        console.log(htmlViews);
        this.views = a.map((item) => new View(item));
    }

    setTopPub() {
        const topPub = document.querySelector('.top-pub');
        if (Account.isSignedIn()) {
            topPub.setAttribute('style', 'display: flex');
        } else {
            topPub.setAttribute('style', 'display: none');
        }
    }

    changeView(viewName, _wasPopState) {
        this.setTopPub();
        let goTo = viewName;
        if (this.activeView) this.activeView.hideError();
        if (viewName === this.activeView?.name) return;
    
        if (
            !Account.isSignedIn() &&
             (viewName !== 'login' && viewName !== 'signup')
        ) goTo = 'login';
    
        if (goTo === window.location.pathname) return;
    
        this.views.forEach((view) => {
            console.log(view.name);
            if (view.name === goTo) view.show();
            else view.hide();
        });
        this.activeView = this.getView(goTo)
    
        if (goTo !== 'loader' && !_wasPopState) {
            console.log('Pushing state: ', goTo);
            history.pushState({ view: goTo }, '', `/${goTo}`);
        }
    }

    showPublist() {
        this.activeView.showComponent('pub_list');
    }

    goToHome() {
        const homeView = this.getView('home');
        if(Account.hasPubcrawl()) {
            homeView.showComponent('pub_list');
        } else {
            homeView.showComponent('pub_create');
        }
        this.changeView('home');
    }

    showLoader() {
        this.activeView.showLoader();
    }

    hideLoader() {
        this.activeView.hideLoader();
    }

    showError(msg) {
        console.log('Show error', this.activeView);
        this.activeView.showError(msg);
    }

    hideError() {
        this.activeView.hideError();
    }

    clearInputs() {
        this.activeView.clearInputs();
    }

    getView(name) {
        const v = this.views.find((view) => view.name === name);
        return v;
    }
}

export default new ViewController();