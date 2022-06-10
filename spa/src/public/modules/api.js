import ViewController from "./view.controller.js";

export default class AjaxClient {

    static async post(url, body, method = 'POST') {
        try {
            ViewController.showLoader();
            const headers = {
                'Authorization': `Bearer ${localStorage.accessToken}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(url, {
                method: method,
                headers,
                body: JSON.stringify(body),
            });
            let data = {};
            try {
                data = await response.json();
            } catch (e) {
                // Post might not return data, do nothing.
            }
            const res = {
                response,
                data,
            }
            ViewController.hideLoader();
            return res;
        } catch (error) {
            console.log('Post error: ', error);
            ViewController.hideLoader();
            return;
        }
    }

    static async get(url) {
        try {
            ViewController.showLoader();
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.accessToken}`,
                    accept: 'application/json',
                },
            });
            let data = {};
            try {
                data = await response.json();
            } catch (e) {
                console.log('Error could not parse data ', e);
            }
            const res = {
                response,
                data,
            }
            ViewController.hideLoader();
            return res;            
        } catch (e) {
            console.log('Get error: ', e);
            ViewController.hideLoader();
            return;
        }
    }

    static async delete(url) {
        try {
            ViewController.showLoader();
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.accessToken}`,
                    accept: 'application/json',
                },
            });
            let data = {};
            try {
                data = await response.json();
            } catch (e) {
                console.log('Error could not parse data ', e);
            }
            const res = {
                response,
                data,
            }
            ViewController.hideLoader();
            return res;
        } catch (e) {
            console.log('Get error: ', e);
            ViewController.hideLoader();
            return;
        }
    }

    static async put(url, body) {
        const res = await AjaxClient.post(url, body, 'PUT');
        return res;
    }
}