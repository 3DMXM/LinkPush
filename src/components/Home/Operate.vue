<script lang='ts' setup>
import { ipcRenderer } from "electron";
import { link } from "fs";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import Dialog from '@src/components/Dialog.vue'

const store = useStore();
const router = useRouter();

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

let message = ref("")
let showDialog = ref(false)
let confirmText = ref("确定")
let cancelText = ref("取消")
let confirm = ref(() => {
    router.push({ name: 'Configuration' })
})

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

    if (links.value.length == 0) {
        message.value = "请先输入要提交的链接地址"
        showDialog.value = true
        confirm.value = () => {
            showDialog.value = false
        }
        return
    }

    // 将 links 分割为每组2000条 links = [[...],[...]]
    let _links = getNewArray(links.value, 500)

    _links.forEach(item => {
        if (searchEngine.value.baidu) {

            if (!baidu.value.token) {
                message.value = "请先配置百度推送token"
                showDialog.value = true
                confirm.value = () => {
                    router.push({ name: 'Configuration' })
                }
                return
            }
            ipcRenderer.send('pubs-baidu', {
                links: item,
                site: site.value?.toString(),
                token: baidu.value.token,
                daily: baidu.value.daily
            })
        }
        if (searchEngine.value.bing) {
            if (!bing.value.token) {
                message.value = "请先配置必应推送token"
                showDialog.value = true
                confirm.value = () => {
                    router.push({ name: 'Configuration' })
                }
                return
            }

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
    <Teleport to="body">
        <Dialog title="提示" :message="message" :cancelText="cancelText" :confirmText="confirmText"
            v-model:value="showDialog" @cancel="showDialog = false" @confirm="confirm">
        </Dialog>
    </Teleport>
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