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
        },
        {
            path: "/settings",
            name: "Settings",
            component: () => import("@src/views/Settings.vue"),
        },
        {
            path: "/about",
            name: "About",
            component: () => import("@src/views/About.vue"),
        },
        {
            // ćĺŠć
            path: "/donate",
            name: "Donate",
            component: () => import("@src/views/Donate.vue"),
        }
    ]
});


export default router;