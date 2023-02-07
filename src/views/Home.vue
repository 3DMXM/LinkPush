<script lang='ts' setup>
import HomeHeader from '@src/components/Home/Header.vue'
import HomeLink from '@src/components/Home/Link.vue'
import HomeOperate from '@src/components/Home/Operate.vue'
import HomeResponse from '@src/components/Home/Response.vue'

</script>
<template>
    <div class="home">
        <HomeHeader></HomeHeader>
        <HomeLink></HomeLink>
        <HomeOperate></HomeOperate>
        <HomeResponse></HomeResponse>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'Home',
}
</script>
<style lang='less' scoped>

</style>