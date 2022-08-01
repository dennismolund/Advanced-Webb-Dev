import User from './user.state.js';

export default class View {
    constructor(view) {
        this.element = view;
        this.content = view.querySelector('.content');
        this.loader = view.querySelector('.loader');
        this.name = view.id;
        this.errElm = this.element.querySelector('.error__container');
    }

    hide() {
        this.element.setAttribute('style', 'display: none');
    }
    show(display = 'flex') {
        this.element.setAttribute('style', `display: ${display}`);
    }

    showError(eMsg) {
        if (!this.errElm) return;
        this.errElm.innerHTML = eMsg;
        this.errElm.setAttribute('style', 'display: block');
    }

    hideError() {
        if (!this.errElm) return;
        this.errElm.innerHTML = '';
        this.errElm.setAttribute('style', 'display: none');
    }

    showComponent(id) {
        const listComp = this.element.querySelector('#pub_list');
        const createComp = this.element.querySelector('#pub_create');
        listComp.setAttribute('style', 'display: none');
        createComp.setAttribute('style', 'display: none');
        if (listComp.id === id) this.displayPubs(listComp);
        else createComp.setAttribute('style', 'display: block');
    }

    displayPubs(listComp) {
        listComp.setAttribute('style', 'display: block');
        const listItems = listComp.querySelectorAll('.pub__list--item');
        for (let i = 0; i < User.pubList.length; i++) {
            const text = `${i + 1}. ${User.pubList[i].name}`
            listItems[i].innerHTML = text;
        }
    }

    showLoader() {
        this.content.setAttribute('style', 'display: none');
        this.loader.setAttribute('style', 'display: flex');
    }

    hideLoader() {
        this.content.setAttribute('style', 'display: block');
        this.loader.setAttribute('style', 'display: none');
    }

    clearInputs() {
        const inputFields = this.element.querySelectorAll('input');
        inputFields.forEach((input) => {
            input.value = '';
        });
    }
}