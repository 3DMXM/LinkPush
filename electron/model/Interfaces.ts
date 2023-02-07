export interface IConfig {
    sitemap: string
    searchEngine: {
        baidu: boolean
        bing: boolean
        google: boolean
    }
    baidu: {
        site: string
        token: string
        daily: boolean
    }
    bing: {
        site: string
        token: string
    }
}