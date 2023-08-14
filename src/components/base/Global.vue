<script lang='ts' setup>
import { watch, } from "vue";
import { useSettings } from "@src/stores/useSettings";
import { Config } from '@src/model/Config'


const settings = useSettings()


// 初始化设置
Config.initialization()
watch(() => settings.settings, () => {
    Config.setConfig(settings.settings)
}, { deep: true })

</script>
<template></template>
<script lang='ts'>

export default {
    name: 'Global',
}
</script>
<style lang='less' scoped></style>