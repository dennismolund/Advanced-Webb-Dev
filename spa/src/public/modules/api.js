export default class AjaxClient {

    static async post(url, body, _headers) {

        try {
            const headers = {
                'Authorization': `Bearer ${localStorage.accessToken}`,
                'Content-Type': 'application/json'
            };
            Object.assign(headers, _headers);
            const response = await fetch(url, {
                method: 'POST',
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
            return res;
        } catch (error) {
            console.log('Post error: ', error);
            return;
        }
    }

    static async get(url) {
        try {
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
            return res;            
        } catch (e) {
            console.log('Get error: ', e);
            return;
        }
    }
}