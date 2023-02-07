import { ipcRenderer } from 'electron'
import { createStore, StoreOptions } from 'vuex'


function SetConfig(sitemap: any, searchEngine: any, baidu: any, bing: any) {
    // console.log(sitemap, searchEngine, baidu, bing);
    // 移除他们的响应式
    sitemap = JSON.parse(JSON.stringify(sitemap))
    searchEngine = JSON.parse(JSON.stringify(searchEngine))
    baidu = JSON.parse(JSON.stringify(baidu))
    bing = JSON.parse(JSON.stringify(bing))

    ipcRenderer.invoke('set-config', { sitemap, searchEngine, baidu, bing })
}

let config = {
    sitemap: null,
    searchEngine: null,
    baidu: null,
    bing: null
}

ipcRenderer.invoke('get-config').then((res) => {
    const { sitemap, searchEngine, baidu, bing } = res;
    config.sitemap = sitemap
    config.searchEngine = searchEngine
    config.baidu = baidu
    config.bing = bing
})

const store = createStore({
    state() {
        // 静态数据
        return {
            links: [],
            sitemap: '',
            searchEngine: {
                baidu: true,
                bing: true,
                google: false,
            },
            baidu: {
                token: '',
                daily: false
            },
            bing: {
                token: '',
            }
        }
    },
    mutations: {
        // 修改静态数据的值
        setLinks(state, links) {
            state.links = links
        },
        setSitemap(state, sitemap) {
            state.sitemap = sitemap
            SetConfig(sitemap, config.searchEngine, config.baidu, config.bing)
        },
        setSearchEngine(state, searchEngine) {
            state.searchEngine = searchEngine
            SetConfig(config.sitemap, searchEngine, config.baidu, config.bing)
        },
        setBaidu(state, baidu) {
            state.baidu = baidu
            SetConfig(config.sitemap, config.searchEngine, baidu, config.bing)
        },
        setBing(state, bing) {
            state.bing = bing
            SetConfig(config.sitemap, config.searchEngine, config.baidu, bing)
        }

    }
})

export default store
