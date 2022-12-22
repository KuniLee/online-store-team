import { createBrowserHistory } from 'history'
import type { Location } from 'history'

import { Main } from '@/pages/main'
import { NotFound } from '@/pages/404'
import EventEmitter from 'events'

type RouterEventsName = 'ROUTE'

const history = createBrowserHistory()

const PATHS = {
    catalog: '/',
    item: '/item',
    notFound: '/404',
    cart: '/cart',
}

const ROUTES: Record<typeof PATHS[keyof typeof PATHS], string> = {
    [PATHS.catalog]: 'catalog',
    [PATHS.item]: 'item',
    [PATHS.cart]: 'cart',
    [PATHS.notFound]: 'notFound',
}

export type RouterInstance = InstanceType<typeof Router>

export class Router extends EventEmitter {
    constructor() {
        super()
        // history.listen(({ location }) => {
        //     this.emit('ROUTE', location.pathname)
        //     this.processRoutes(location)
        // })
    }

    init() {
        this.processRoutes(history.location)
    }

    emit(event: RouterEventsName, location: string) {
        return super.emit(event, location)
    }

    processRoutes(location: Location) {
        const route = location.pathname.split('/')
        console.log(location.pathname)
        const mainPath = '/' + route[1]
        if (Object.prototype.hasOwnProperty.call(ROUTES, mainPath)) {
            switch (mainPath) {
                case PATHS.catalog:
                    if (location.pathname !== '/') history.push('/')
                    break
                case PATHS.notFound:
                    if (location.pathname !== '/404') history.push('/')
                    break
            }
        }
    }
}
