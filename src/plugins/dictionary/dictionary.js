import axios from 'axios'
import CryptoJS from 'crypto-js'
import secret from './secret.json'

function _query(q, callback) {
    console.log(callback)
    const appKey = secret.appKey
    const key = secret.key
    const salt = (new Date).getTime()
    const curtime = Math.round(new Date().getTime() / 1000)
    const str1 = appKey + truncate(q) + salt + curtime + key
    const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex)
    axios.get('http://openapi.youdao.com/api', {
        params: {
            q: q,
            appKey: appKey,
            salt: salt,
            from: 'auto',
            to: 'auto',
            sign: sign,
            signType: 'v3',
            curtime: curtime
        }
    }).then(res => {
        console.log(res)
        callback(res.data.basic.explains)
    }).catch(e => {
        console.log(e)
    })
}

function truncate(q) {
    const len = q.length;
    if (len <= 20) {
        return q;
    }
    return q.substring(0, 10) + len + q.substring(len - 10, len);
}

export default {
    match (q) {
        const pattern = /^[A-z]+( [A-z]+)*$/
        return q.search(pattern) === 0
    },
    query (q, callback) {
        console.log(q)
        _query(q, callback)
    }
}
