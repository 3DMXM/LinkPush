<script lang='ts' setup>
import AppHeader from '@src/components/base/AppHeader.vue'
import LeftMenu from '@src/components/base/LeftMenu.vue'
import Global from '@src/components/base/Global.vue'


</script>
<template>
    <v-card>
        <v-layout>
            <Global></Global>
            <AppHeader></AppHeader>
            <LeftMenu></LeftMenu>
            <v-main style="min-height: 100vh;">
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </v-main>
        </v-layout>
    </v-card>
</template>
<script lang='ts'>

export default {
    name: 'App',
}
</script>
<style lang='less' scoped></style>