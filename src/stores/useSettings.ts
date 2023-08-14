import { defineStore } from "pinia";
import type { ISettings } from "@src/model/Interfaces";
import { Config } from '@src/model/Config'


export const useSettings = defineStore('Settings', {
    state: () => ({
        settings: {} as ISettings,
        leftMenuRail: false,
        links: '' as string
    }),
    getters: {
        configFile: () => Config.configFile(),
    },
    actions: {

    }
})