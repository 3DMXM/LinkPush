import { ipcRenderer } from 'electron';
import { ref, computed } from 'vue'
import { useStore } from "vuex";


export function initialization() {
    const store = useStore();
    ipcRenderer.invoke('get-config').then((res) => {
        const { sitemap, searchEngine, baidu, bing } = res;

        let _sitemap = computed({
            get: () => store.state.baidu,
            set: (value) => store.commit('setSitemap', value)
        })
        let _searchEngine = computed({
            get: () => store.state.searchEngine,
            set: (value) => store.commit('setSearchEngine', value)
        })
        let _baidu = computed({
            get: () => store.state.baidu,
            set: (value) => store.commit('setBaidu', value)
        })
        let _bing = computed({
            get: () => store.state.bing,
            set: (value) => store.commit('setBing', value)
        })

        _sitemap.value = sitemap
        _searchEngine.value = searchEngine
        _baidu.value = baidu
        _bing.value = bing

        console.log("初始化完成!");
    })
}   