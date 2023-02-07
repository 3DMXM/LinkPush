<script lang='ts' setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();

let links = computed({
    get: () => store.state.links.join('\n'),
    set: (value) => {
        let list = value.split(/\r?\n/);
        store.commit('setLinks', list)
    }
})
let sitemap = computed({
    get: () => store.state.sitemap,
    set: (value) => store.commit('setSitemap', value)
})

let linksArr = computed<string[]>(() => {
    let list = links.value.split(/\r?\n/)
    // 移除空值
    list = list.filter((d: string) => d)
    return list
})
</script>
<template>
    <el-row>
        <el-col :span="24">
            <el-form-item label="sitemap">
                <el-input v-model="sitemap" />
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <div class="link">提交的链接: <span>( {{ linksArr.length }} )</span></div>
            <el-input v-model="links" type="textarea" :rows="10" wrap="off" />
        </el-col>
    </el-row>
</template>
<script lang='ts'>

export default {
    name: 'HomeLink',
}
</script>
<style lang='less' scoped>
.link {
    font-size: 12px;
    margin-bottom: 10px;

    span {
        color: #848485;
    }
}
</style>