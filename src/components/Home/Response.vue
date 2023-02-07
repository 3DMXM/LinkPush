<script lang='ts' setup>

import { ipcRenderer } from 'electron';
import { ref } from 'vue'

let responst = ref('')

ipcRenderer.on('pubs-reply', (_event, data) => {
    responst.value += data + '\n'
})

</script>
<template>
    <div class="responst">
        <div class="h4-title">返回数据</div>
        <el-input v-model="responst" type="textarea" :rows="5" />
    </div>
</template>
<script lang='ts'>

export default {
    name: 'HomeResponse',
}
</script>
<style lang='less' scoped>

</style>