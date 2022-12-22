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

const ROUTES: Record<typeof PATHS[keyof typeof PATHS], keyof typeof PATHS> = {
    [PATHS.catalog]: 'catalog',
    [PATHS.item]: 'item',
    [PATHS.cart]: 'cart',
    [PATHS.notFound]: 'notFound',
}

export type RouterInstance = InstanceType<typeof Router>

export class Router extends EventEmitter {
    private pathParts: Array<string> = []

    constructor() {
        super()
        history.listen(({ location }) => {
            this.processRoutes(location)
        })
    }

    init() {
        this.processRoutes(history.location)
    }

    emit(event: RouterEventsName, page: keyof typeof PATHS, arg?: string) {
        return super.emit(event, page, arg)
    }

    push(path: string) {
        history.push(path)
    }
    goToItem(path: string) {
        history.push(path)
    }

    private push404() {
        this.push(PATHS.notFound)
    }

    processRoutes(location: Location) {
        this.pathParts = Array.from(location.pathname.match(/\/[a-z0-9]+/gi) || ['/'])
        if (Object.prototype.hasOwnProperty.call(ROUTES, this.pathParts[0])) {
            switch (this.pathParts[0]) {
                case PATHS.catalog:
                case PATHS.cart:
                case PATHS.notFound:
                    if (this.pathParts.length === 1) {
                        this.emit('ROUTE', ROUTES[this.pathParts[0]])
                    } else this.push404()
                    break
                case PATHS.item:
                    if (this.pathParts.length === 2) {
                        this.emit('ROUTE', ROUTES[PATHS.item], this.pathParts[1])
                        break
                    } else this.push404()
            }
        } else this.push404()
    }
}
