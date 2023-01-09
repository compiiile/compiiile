import {useHead} from "@vueuse/head"
import {useRoute} from "vue-router"

export const setUpUseHead = () => {
    const titleTemplate = import.meta.env.VITE_COMPIIILE_TITLE ? ` | ${ import.meta.env.VITE_COMPIIILE_TITLE }` : ''
    const description = useRoute().meta.description || import.meta.env.VITE_COMPIIILE_DESCRIPTION

    const title = useRoute().meta.title

    useHead({
        title,
        titleTemplate: `%s${ titleTemplate }`,
        meta: [
            { name: 'og:title', content: title + titleTemplate },
            { name: 'description', content: description },
            { name: 'og:description', content: description },
            { name: 'og:image', content: `${window.location.host}/favicon.png` },
        ]
    })
}
