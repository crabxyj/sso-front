import axios from 'axios';
// import {Message} from 'element-ui'
import qs from 'qs'

const TIME_OUTM_MS = 60 * 1000

var hosts = {
    // 'sso': '/api',
    'sso': 'http://rap2api.taobao.org/app/mock/239305/'
}

var ports = {
    'roleLoad': 'permission/role/load'
}

function handleUrl (hostName, port) {
    let fullUrl = hosts[hostName] + ports[port];
    console.log(fullUrl);
    return fullUrl;
}

function myGet (hostName, port, data = {}, response, exception) {
    axios({
        method: 'get',
        url: handleUrl(hostName, port),
        timeout: TIME_OUTM_MS,
        params: data,
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    }).then(result => {
        response(result.data);
    }).catch(error => {
        exception ? exception(error) : console.log(error);
    })
}

function myPost (hostName, port, data = {}, response, exception) {
    axios({
        method: 'POST',
        url: handleUrl(hostName, port),
        timeout: TIME_OUTM_MS,
        data: qs.stringify(data),
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    }).then(result => {
        response(result.data);
    }).catch(error => {
        exception ? exception(error) : console.log(error);
    })
}

export default {
    myGet,
    myPost
}
