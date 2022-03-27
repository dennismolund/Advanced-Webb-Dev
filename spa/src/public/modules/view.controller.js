import View from './view.js';
import User from './user.state.js';

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

    setTopBar() {
        const topBar = document.querySelector('.top-bar');
        if (User.isSignedIn()) {
            topBar.setAttribute('style', 'display: flex');
        } else {
            topBar.setAttribute('style', 'display: none');
        }
    }

    changeView(viewName, _wasPopState) {
        this.setTopBar();
        let goTo = viewName;
        if (this.activeView) this.activeView.hideError();
        if (viewName === this.activeView?.name) return;
    
        if (
            !User.isSignedIn() &&
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

    showBarlist() {
        this.activeView.showComponent('bar_list');
    }

    goToHome() {
        const homeView = this.getView('home');
        if(User.hasBarrunda()) {
            // todo
            homeView.showComponent('bar_list');
        } else {
            homeView.showComponent('bar_create');
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