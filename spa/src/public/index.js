import ViewController from './modules/view.controller.js';
import AjaxClient from './modules/api.js';
import User from './modules/user.state.js';

const client_id = "YmFycnVuZGFfc3BhX2NsaWVudF9pZF9oZWpjb24=";

document.addEventListener('DOMContentLoaded', async () => {
    setListeners();
    ViewController.setViewList();
    // ViewController.changeView('loader');
    await setPage();
});

const setPage = async () => {
    const pathname = window.location.pathname;
    console.log('Pathname: ', pathname);
    // if (User.token) {
    //     await silentLogin();
    // }
    if (!User.isSignedIn()) {
        if (pathname.includes('login')) {
            ViewController.changeView('login');
        } else if (pathname.includes('signup')) {
            ViewController.changeView('signup');
        } else {
            ViewController.changeView('login');
        }
    }
}

const setListeners = () => {
    window.onpopstate = (evt) => {
        console.log('Popping state: ', evt.state);
        if (!evt.state) history.back();
        else ViewController.changeView(evt.state.view, true);
    };

    document.addEventListener('loginClick', (evt) => {
        ViewController.hideError();
        login();
    });

    document.addEventListener('navigateLogin', (evt) => {
        evt.preventDefault();
        if(User.isSignedIn()) User.logout();
        ViewController.changeView('login');
    });

    document.addEventListener('navigateSignup', (evt) => {
        evt.preventDefault();
        if(User.isSignedIn()) User.logout();
        ViewController.changeView('signup')
    });

    document.addEventListener('keyup', (evt) => {
        if (evt.keyCode === 13) {
            if (ViewController.activeView.name === 'login') {
                document.dispatchEvent(new Event('loginClick'));
            } else if (ViewController.activeView.name === 'signup') {
                document.dispatchEvent(new Event('signupClick'));
            }
        }
    });

    document.addEventListener('signupClick', (evt) => {
        signup();
    });

    document.addEventListener('createBarrundaClick', (evt) => {
        if (!User.isSignedIn()) changeView('login');
        createBarrunda();
    });

    document.addEventListener('newBarrundaClick', (evt) => {
        if (!User.isSignedIn()) changeView('login');
        createBarrunda();
    });
    document.addEventListener('removeBarrundaClick', (evt) => {
        if (!User.isSignedIn()) changeView('login');
        removeBarrunda();
    });
}

const signup = async () => {
    ViewController.hideError();

    if (User.isSignedIn()) {
        ViewController.changeView('home');
        return;
    }
    const newUser = {};
    newUser.username = document.querySelector('#new_username').value || '';
    newUser.email = document.querySelector('#new_email').value || '';
    newUser.password = document.querySelector('#new_password_1').value || '';
    newUser.confirmPassword = document.querySelector('#new_password_2').value || '';

    const validationError = validateNewUser(newUser);

    if (validationError) {
        ViewController.showError(validationError);
        ViewController.clearInputs();
        return;
    }

    const response = await AjaxClient.post('http://localhost:3002/api/anvandare/signup', newUser);

    const requestError = checkResponse(response);

    if (requestError) return;

    ViewController.changeView('login');
    
}

const checkResponse = (pack) => {
    console.log(pack);
    if (pack.response && pack.response.status === 204) return;
    else if (!pack.response) {
        ViewController.showError('There was an error');
        return true;
    }
    else if (pack.response.status !== 200) {
        console.log(pack.response);
        if (pack.data) {
            if (pack.data.error_description) ViewController.showError(pack.data.error_description);
            else ViewController.showError(pack.data.error);
        } else {
            ViewController.showError('There was an error');
        }
        ViewController.clearInputs();
        return true;
    }
}

const login = async () => {
    ViewController.hideError();
    ViewController.changeView('loader');
    const username = document.querySelector('#username_in').value;
    const password = document.querySelector('#password_in').value;
    if (!username) {
        ViewController.showError('Fyll i användarnamn');
        return;
    }
    
    if (!password) {
        ViewController.showError('Fyll i lösenord');
        return;
    }

    const url = `http://localhost:3002/api/anvandare/login?grant_type=password&username=${username}&password=${password}&client_id=${client_id}`;
    const response = await AjaxClient.post(url,{});

    const requestError = checkResponse(response);

    if (requestError) return;

    User.init(response.data);
    await User.loadData();
    ViewController.goToHome();
}

const createBarrunda = async () => {
    ViewController.hideError();
    const response = await AjaxClient.get('http://localhost:3002/api/bars/new');

    const requestError = checkResponse(response);

    if (requestError) return;

    onBarrundaReceived(response.data);
}

const removeBarrunda = async () => {
    ViewController.hideError();
    const id = User.barrundaid;
    const response = await AjaxClient.get(`http://localhost:3002/api/bars/delete/${id}`);

    const errorResponse = checkResponse(response);
    if (errorResponse) return;

    onBarrundaRemoved();
}

const onBarrundaRemoved = () => {
    User.barList = [];
    User.barrundaid = null;
    ViewController.goToHome();
}

const onBarrundaReceived = (data) => {
    User.setBarList(data);
    if (ViewController.activeView.name === 'home') {
        console.log('Displaying bar list');
        ViewController.showBarlist();
    } else {
        console.log('Changing view to home');
        ViewController.changeView('home');
    }
}

const validateNewUser = (user) => {
    console.log('Validate new user: ', user);
    const keys = Object.keys(user);
    for(let i = 0; i < keys.length; i++) {
        if (!user[keys[i]]) {
            return `Please enter ${keys[i]}`;
        }
    };

    if (user.password !== user.confirmPassword) {
        return 'Passwords must match'
    }
}