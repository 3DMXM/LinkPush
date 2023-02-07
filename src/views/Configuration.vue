<script lang='ts' setup>
import ConfigurationBaidu from '@src/components/Configuration/Baidu.vue'
import ConfigurationBing from '@src/components/Configuration/Bing.vue'
</script>
<template>
    <div class="Configuration">
        <div class="h2-title">接口配置</div>
        <el-divider />
        <ConfigurationBaidu></ConfigurationBaidu>
        <ConfigurationBing></ConfigurationBing>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'Configuration',
}
</script>
<style lang='less' scoped>
.Configuration {
    overflow: auto;
    height: 100%;
}
</style>