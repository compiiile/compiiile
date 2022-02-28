import { createRouter, createWebHashHistory } from 'vue-router';
import routes from "~ahah"



const ah = routes.map(route => {
    if(route.path){
        route.component = () => import(/* @vite-ignore */route.path);
    }
    return route
})

console.log(ah)

export default createRouter({
    history: createWebHashHistory(),
    routes: ah,
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
