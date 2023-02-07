import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: () => import("@src/views/Home.vue"),
        },
        {
            path: "/configuration",
            name: "Configuration",
            component: () => import("@src/views/Configuration.vue"),
            children: [
                {
                    path: "baidu",
                    name: "ConfigurationBaidu",
                    component: () => import("@src/components/Configuration/Baidu.vue"),
                }
            ]
        },
        {
            // 设置
            path: "/settings",
            name: "Settings",
            component: () => import("@src/views/Settings.vue"),
        },
        {
            path: "/about",
            name: "About",
            component: () => import("@src/views/About.vue"),
        }
    ]
});


export default router;