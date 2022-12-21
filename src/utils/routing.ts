import { createBrowserHistory } from 'history'
import type { Location } from 'history'

import { Root } from '@/pages/root'
import { NotFound } from '@/pages/404'

const history = createBrowserHistory()

const main = document.querySelector('#app')

const PATHS = {
    root: '/',
    //  item: '/item',
    notFound: '/404',
}

const ROUTES: Record<typeof PATHS[keyof typeof PATHS], (location: Location) => HTMLDivElement> = {
    [PATHS.root]: Root,
    // [PATHS.item]: Item,
    [PATHS.notFound]: NotFound,
}

function processRoutes(location: Location) {
    const route = ROUTES[location.pathname]

    if (route && main) {
        main.innerHTML = ''
        main.appendChild(route(location))
    } else {
        history.push(PATHS.notFound)
    }
}

history.listen(({ location }) => {
    processRoutes(location)
})

processRoutes(history.location)
