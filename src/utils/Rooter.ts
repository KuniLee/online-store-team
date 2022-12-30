import { createBrowserHistory } from 'history'
import type { Location, Search } from 'history'

import EventEmitter from 'events'

type RouterEventsName = 'ROUTE'

const history = createBrowserHistory()

const paths = ['/', '/item', '/404', '/cart']
export type Paths = '/' | '/item' | '/404' | '/cart'

export type RouterInstance = InstanceType<typeof Router>

export class Router extends EventEmitter {
    public pathParts: Array<string> = []

    constructor() {
        super()
        history.listen(({ location, action }) => {
            this.processRoutes(location)
        })
    }

    init() {
        this.processRoutes(history.location)
    }

    emit(event: RouterEventsName, page: Paths, arg?: { path: string; search?: Search }) {
        return super.emit(event, page, arg)
    }

    push(path: string) {
        history.push(path)
    }

    private push404() {
        this.push('/404')
    }

    processRoutes(location: Location) {
        this.pathParts = Array.from(location.pathname.match(/\/[a-z0-9]+/gi) || ['/'])
        if (paths.includes(this.pathParts[0]) && this.pathParts.length <= 2) {
            this.emit('ROUTE', this.pathParts[0] as Paths, { path: this.pathParts[1], search: location.search })
        } else this.push404()
    }

    setQueries() {
        history.replace({ search: '?q=4' })
    }
}
