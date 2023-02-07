<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

let baidu = computed({
    get: () => store.state.baidu,
    set: (value) => store.commit('setBaidu', value)
});

function save() {
    store.commit('setBaidu', baidu.value);
}

</script>
<template>
    <div class="baidu">
        <div class="h3-title">百度接口配置</div>
        <el-form label-width="80px">
            <!-- <el-form-item label="site">
                <el-input v-model="baidu.site" />
            </el-form-item> -->
            <el-form-item label="Token">
                <el-input v-model="baidu.token" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'ConfigurationBaidu',
}
</script>
<style lang='less' scoped>

</style>