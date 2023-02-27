import axios from 'axios';

export const REQUEST_METHOD = Object.freeze({
    DELETE: "delete",
    GET : "get",
    POST: "post",
    PUT: "put",
    UPDATE: "update"
});

export default class api {
    
    request(path, token, method = REQUEST_METHOD.GET, data = null) {
        console.log(`api uri: ${process.env.REACT_APP_PORTAL_API_URI}`);
        return new Promise((resolve, reject) => {
            let requestConfig = {
                baseURL: process.env.REACT_APP_PORTAL_API_URI,
                url: path,
                method: method,
                //headers: {
                //    "Authorization": `Bearer ${token}`
                //}
            };

            if(data !== null) {
                requestConfig.data = data;
            }

            axios(requestConfig)
            .then(resp => {
                resolve(resp.data);
            })
            .catch(err => {
                reject(err);
            });
        });
    }
}