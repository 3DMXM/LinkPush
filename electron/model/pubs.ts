import http from 'node:http'
// import request from 'request'
const request = require("request");

export function PubsToBaidu(links: string[], site: string, token: string, daily: boolean, callback: (err: Error | null, data?: any) => void) {

    let type = daily ? '&type=realtime' : ''
    let options = {
        // host: 'http://data.zz.baidu.com',
        // path: `urls?site=${site}&token=${token}${type}`,
        url: `http://data.zz.baidu.com/urls?site=${site}&token=${token}${type}`,
        method: 'POST',
        headers: {
            'user-agent': 'curl/7.12.1',
            'host': 'data.zz.baidu.com',
            'content-type': 'text/plain',
        },
        body: links.join('\n')
    }
    request(options, function (error, response, body) {
        // 接收返回值
        callback(null, body)
    })
}

export function PubsToBing(urlList: string[], siteUrl: string, token: string, callback: (err: Error | null, data?: any) => void) {
    let options = {
        url: `https://ssl.bing.com//webmaster/api.svc/json/SubmitUrlbatch?apikey=${token}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            "siteUrl": siteUrl,
            "urlList": urlList
        })
    }
    request(options, function (error, response, body) {
        callback(null, body);
    })
}