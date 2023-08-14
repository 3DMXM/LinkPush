<script lang='ts' setup>
import { useMain } from '@src/stores/useMain';
import { useSettings } from '@src/stores/useSettings';


const main = useMain()
const settings = useSettings()

let lists = [
    {
        title: '首页',
        icon: "mdi-home",
        path: '/',
    },
    {
        title: '设置',
        icon: "mdi-cog",
        path: '/settings',
    },
    {
        title: '关于',
        icon: "mdi-information",
        path: '/about',
    }
]

</script>
<template>
    <v-navigation-drawer v-model="main.leftMenu" :rail="settings.leftMenuRail" permanent width="200">
        <v-list>
            <v-list-item v-for="item in lists" :key="item.path" :to="item.path" :prepend-icon="item.icon"
                :title="item.title">
            </v-list-item>
        </v-list>
        <template v-slot:append>
            <v-list>
                <v-list-item @click="settings.leftMenuRail = !settings.leftMenuRail"
                    :prepend-icon="settings.leftMenuRail ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left'">
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>
<script lang='ts'>

export default {
    name: 'LeftMenu',
}
</script>
<style lang='less' scoped></style>