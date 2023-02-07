<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

let bing = computed({
    get: () => store.state.bing,
    set: (value) => store.commit('setBing', value)
});

function save() {
    store.commit('setBing', bing.value);
}

</script>
<template>
    <div class="baidu">
        <div class="h3-title">Bing接口配置</div>
        <el-form label-width="80px">
            <!-- <el-form-item label="site">
                <el-input v-model="bing.site" />
            </el-form-item> -->
            <el-form-item label="Token">
                <el-input v-model="bing.token" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'ConfigurationBing',
}
</script>
<style lang='less' scoped>

</style>