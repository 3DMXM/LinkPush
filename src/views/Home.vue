<script lang='ts' setup>
import { useSettings } from '@src/stores/useSettings';
import { ref, computed, watch } from "vue";
import { ipcRenderer } from 'electron'
import { ElMessage } from 'element-plus';

const settings = useSettings()

//#region 提交开关

watch(() => settings.settings.baidu.push, () => {
    if (settings.settings.baidu.push == true && settings.settings.baidu.token == '') {
        ElMessage.error('请先设置百度token')
        settings.settings.baidu.push = false
    }
})

watch(() => settings.settings.bing.push, () => {
    if (settings.settings.bing.push == true && settings.settings.bing.token == '') {
        ElMessage.error('请先设置Bing token')
        settings.settings.bing.push = false
    }
})

watch(() => settings.settings.baidu.daily, () => {
    if (settings.settings.baidu.daily == true && settings.settings.baidu.token == '') {
        ElMessage.error('请先设置百度token')
        settings.settings.baidu.daily = false
    }
})

//#endregion

//#region 从 sitemap 获取链接

let linksArr = computed<string[]>(() => {
    let list = settings.links.split(/\r?\n/)
    // 移除空值
    list = list.filter((d: string) => d)
    return list
})
let sitemapLoading = ref(false)
let submitLoading = ref(false)
async function getSitemap() {
    // 判断 settings.settings.sitemap 是否是 xml 文件
    if (!settings.settings.sitemap.endsWith('.xml')) {
        ElMessage.error('sitemap 必须是 xml 文件')
        return
    }
    sitemapLoading.value = true
    let sitemap: string[] = await ipcRenderer.invoke("get-sitemap", settings.settings.sitemap)
    if (sitemap.length > 0) {
        settings.links = sitemap.join('\n')
    } else {
        ElMessage.error('sitemap 无法获取到链接')
    }
    sitemapLoading.value = false
}

//#endregion


//#region 提交

let responst = ref('')
let links = computed(() => {
    let list = settings.links.split(/\r?\n/)
    list = list.filter((d: string) => d)    // 移除空值
    return list
})

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
        ElMessage.error('请先获取链接')
        return
    }

    // 将 links 分割为每组500条 links = [[...],[...]]
    let _links = getNewArray(links.value, 500)

    submitLoading.value = true


    _links.forEach(async item => {
        if (settings.settings.baidu.push) {
            responst.value += await ipcRenderer.invoke('pubs-baidu', {
                links: item,
                site: site.value,
                token: settings.settings.baidu.token,
                daily: settings.settings.baidu.daily
            })
        }
        if (settings.settings.bing.push) {
            responst.value += await ipcRenderer.invoke('pubs-bing', {
                links: item,
                site: site.value,
                token: settings.settings.bing.token
            })
        }
    })

    submitLoading.value = false
}


function getNewArray(arr: string[], size: number) {
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
//#endregion

</script>
<template>
    <v-container fluid class="home">
        <v-card title="提交">
            <v-card-text>
                <v-row>
                    <v-col cols="12" class="switch">
                        <v-switch v-model="settings.settings.baidu.push" color="#00ACC1" label="百度提交"></v-switch>
                        <v-switch v-model="settings.settings.bing.push" color="#00ACC1" label="Bing急速收录"></v-switch>
                        <v-switch v-model="settings.settings.baidu.daily" color="#00ACC1" label="百度天级收录"></v-switch>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="sitemap" v-model="settings.settings.sitemap"
                            variant="underlined"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea :label="`提交的链接(${linksArr.length})`" v-model="settings.links"
                            variant="outlined"></v-textarea>
                        <div class="btn">
                            <v-btn variant="text" :loading="sitemapLoading" @click="getSitemap"
                                append-icon="mdi-chart-donut">从Sitemap获取</v-btn>
                            <v-btn variant="text" :loading="submitLoading" color="#00ACC1" append-icon="mdi-pulse"
                                @click="submit">提交</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea label="返回数据" v-model="responst" variant="outlined" rows="3"></v-textarea>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script lang='ts'>

export default {
    name: 'Home',
}
</script>
<style lang='less' scoped>
.home {
    .switch {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .btn {
        text-align: right;
    }
}
</style>