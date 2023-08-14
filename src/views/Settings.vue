<script lang='ts' setup>
import { useSettings } from '@src/stores/useSettings';


const settings = useSettings()

</script>
<template>
    <v-container fluid class="Settings">
        <v-card title="设置">
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="settings.settings.baidu.token" label="百度 token"
                            variant="underlined"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="settings.settings.bing.token" label="Bing token"
                            variant="underlined"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script lang='ts'>

export default {
    name: 'Settings',
}
</script>
<style lang='less' scoped></style>