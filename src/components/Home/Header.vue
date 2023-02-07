<script lang='ts' setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";

const store = useStore();


let searchEngine = computed({
    get: () => store.state.searchEngine,
    set: (value) => store.commit('setSearchEngine', value)
})

let baidu = computed({
    get: () => store.state.baidu,
    set: (value) => store.commit('setBaidu', value)
})

</script>
<template>
    <el-row>
        <el-col :span="24" class="home-header">
            <el-form-item label="百度提交" class="search-item">
                <el-switch v-model="searchEngine.baidu" />
            </el-form-item>
            <el-form-item label="Bing急速收录" class="search-item" title="如果链接没问题,会在10分钟内收录">
                <el-switch v-model="searchEngine.bing" />
            </el-form-item>
            <el-form-item label="Google提交" class="search-item" title="暂未支持">
                <el-switch v-model="searchEngine.google" disabled />
            </el-form-item>
            <template v-if="searchEngine.baidu">
                <el-form-item label="百度天级收录" class="search-item" title="启用天级收录请先确保您有足够的配额">
                    <el-switch v-model="baidu.daily" />
                </el-form-item>
            </template>
        </el-col>
    </el-row>
</template>
<script lang='ts'>

export default {
    name: 'HomeHeader',
}
</script>
<style lang='less' scoped>
.home-header {
    display: flex;

    .search-item {
        margin-right: 20px;
        margin-bottom: 0;
    }
}
</style>