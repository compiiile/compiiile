import {createRouter, createWebHashHistory} from 'vue-router';
import WorkspacePage from "../pages/workspace/WorkspacePage.vue";
import SlidesPage from "../pages/slides/SlidesPage.vue";
import SlidesContent from "../pages/slides/SlidesContent.vue";
import Content from "../pages/workspace/Content.vue";

import {routeList} from "virtual:compiiile"

const workspaceRoutes = routeList
    .filter(route => !route.meta.asSlides)
    .map(route => {
        route.component = Content
        return route
    })

const slidesRoutes = routeList
    .filter(route => route.meta.asSlides)
    .map(route => {
        route.component = SlidesContent
        return route
    })

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/c",
            name: "workspace",
            component: WorkspacePage,
            children: workspaceRoutes
        },
        {
            path: "/s",
            name: "slides",
            component: SlidesPage,
            children: slidesRoutes
        }
    ],
    scrollBehavior (to, from, savedPosition) {
        if (to.hash) {
            return { el: to.hash }
        } else if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 }
        }
    }
});
