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
            path: `/c`,
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
        const withScroll = to.params.withScroll ?? true
        // We parse the value because a boolean false value is stored as a string here and needs to be parsed.
        // This is used when scrolling and replacing the current route hash
        if (to.hash && JSON.parse(withScroll)) {
            // Minus 1 to keep the same toc and hash
            return { el: to.hash, top: document.querySelector(".top-bar-content").clientHeight - 1 }
        } else if (savedPosition) {
            return savedPosition;
        } else if(to.name !== from.name) {
            return { top: 0 }
        }
    }
});
