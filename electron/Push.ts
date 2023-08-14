// import http from 'node:http'
import request from 'electron-request';
import { net } from 'electron'

export class Push {
    public static PubsToBaidu(links: string[], site: string, token: string, daily: boolean) {

        let type = daily ? '&type=daily' : ''
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

        console.log(url);


        return request(url, options)
    }

    public static PubsToBing(urlList: string[], siteUrl: string, token: string) {

        let url = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${token}`

        let data = {
            "siteUrl": siteUrl,
            "urlList": urlList
        }

        let options = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            method: 'POST',
            url
        }

        return new Promise((resolve, reject) => {
            const req = net.request(options)
            req.write(JSON.stringify(data))
            req.on('response', (res) => {
                res.on('data', (chunk) => {
                    resolve(chunk.toString())
                })
                res.on('error', (err: any) => {
                    reject(err)
                })
            })
            req.end()
        })
    }
}