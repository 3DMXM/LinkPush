export interface ISettings {
    sitemap: string
    baidu: {
        token: string
        daily: boolean
        push: boolean
    }
    bing: {
        token: string
        push: boolean
    }
} 