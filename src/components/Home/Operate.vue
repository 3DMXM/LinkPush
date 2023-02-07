<script lang='ts' setup>
import { ipcRenderer } from "electron";
import { link } from "fs";
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

let searchEngine = computed(() => store.state.searchEngine)
let baidu = computed(() => store.state.baidu)
let bing = computed(() => store.state.bing)
let sitemap = computed(() => store.state.sitemap)
let links = computed<string[]>(() => {
    let list = store.state.links
    list = list.filter((d: string) => d)    // 移除空值
    return list
})

let sitemapLoading = ref(false)
let submitLoading = ref(false)

function getNewArray(arr: any[], size: number) {
    const arrNum = Math.ceil(arr.length / size);
    let index = 0;
    let resIndex = 0;
    const result = [];
    while (index < arrNum) {
        result[index] = arr.slice(resIndex, size + resIndex);
        resIndex += size;
        index++;
    }
    return result;
}

let site = computed(() => {
    let url = links.value[0]
    if (url) {
        // return url.split('/')[2]
        // 返回包含 https 或http 如 https://www.baidu.com
        if (url.match(/(http|https):\/\/[^/]*/)) {
            return url.match(/(http|https):\/\/[^/]*/)![0]
        } else {
            return 'http://' + url.split('/')[0]
        }
    }
})

function submit() {
    // 将 links 分割为每组2000条 links = [[...],[...]]
    let _links = getNewArray(links.value, 500)

    _links.forEach(item => {
        if (searchEngine.value.baidu) {
            ipcRenderer.send('pubs-baidu', {
                links: item,
                site: site.value?.toString(),
                token: baidu.value.token,
                daily: baidu.value.daily
            })
        }
        if (searchEngine.value.bing) {
            ipcRenderer.send('pubs-bing', {
                links: item,
                site: site.value?.toString(),
                token: bing.value.token,
            })
        }
    })
}

function GetUrlFormSitemap() {
    sitemapLoading.value = true
    ipcRenderer.send("get-sitemap-links", sitemap.value)
}

ipcRenderer.on('get-sitemap-links-reply', (_event, links) => {
    sitemapLoading.value = false
    store.commit("setLinks", links)
})

</script>
<template>
    <el-row>
        <el-col :span="24" class="btn-list">
            <el-button color="#626aef" @click="GetUrlFormSitemap" :loading="sitemapLoading">从sitemap获取</el-button>
            <el-button type="primary" @click="submit" :loading="submitLoading">提交</el-button>
        </el-col>
    </el-row>
</template>
<script lang='ts'>

export default {
    name: 'HomeOperate',
}
</script>
<style lang='less' scoped>
.btn-list {
    text-align: right;
}
</style>