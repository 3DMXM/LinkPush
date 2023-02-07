// import http from 'node:http'
import request from 'electron-request';
import { net, ClientRequestConstructorOptions } from 'electron'

export function PubsToBaidu(links: string[], site: string, token: string, daily: boolean, callback: (err: Error | null, data?: any) => void) {

    let type = daily ? '&type=realtime' : ''
    let url = `http://data.zz.baidu.com/urls?site=${site}&token=${token}${type}`;
    let options = {
        // host: 'http://data.zz.baidu.com',
        // path: `urls?site=${site}&token=${token}${type}`,
        method: 'POST',
        headers: {
            'user-agent': 'curl/7.12.1',
            'content-type': 'text/plain',
        },
        followRedirect: true,
        maxRedirectCount: 20,
        timeout: 0,
        body: links.join('\n')
    }

    request(url, options).then(res => {
        res.text().then((res2) => callback(null, res2))
    }).catch(err => callback(err, null))
}

export function PubsToBing(urlList: string[], siteUrl: string, token: string, callback: (err: Error | null, data?: any) => void) {

    let url = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${token}`

    let data = {
        "siteUrl": siteUrl,
        "urlList": urlList
    }

    const req = net.request({
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        url
    })
    req.write(JSON.stringify(data))
    req.on('response', (res) => {
        res.on('data', (chunk) => {
            callback(null, chunk.toString())
        })
    })

    req.end()
}