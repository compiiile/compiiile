import { createRouter, createWebHashHistory } from 'vue-router';
import WorkspacePage from "../pages/workspace/WorkspacePage.vue";
import SlidesPage from "../pages/slides/SlidesPage.vue";
import Content from "../pages/workspace/Content.vue";

import context from "../utils/context.js"

const generatedRoutes = context.map(route => {
    if(route.path){
        //route.component = () => import(/* @vite-ignore */route.path);
        route.component = Content
    }
    return route
})

console.log(generatedRoutes)

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/c",
            name: "workspace",
            component: WorkspacePage,
            children: generatedRoutes
        },
        {
            path: "/s/:pathMatch(.*)*",
            name: "slides",
            component: SlidesPage
        }
    ],
    /*routes: [
        {
            path: "/test",
            //component: () => import("/Test.md")
            component: "/Test.md",
            customBlock: undefined,
            props: true,
            name: "test"
        }
    ]*/
});
