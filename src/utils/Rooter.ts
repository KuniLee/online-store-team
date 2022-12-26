import { createBrowserHistory } from 'history'
import type { Location } from 'history'

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
        history.listen(({ location }) => {
            this.processRoutes(location)
        })
    }

    init() {
        this.processRoutes(history.location)
    }

    emit(event: RouterEventsName, page: Paths, arg?: string | { path: string }) {
        return super.emit(event, page, arg)
    }

    push(path: Paths) {
        history.push(path)
    }

    private push404() {
        this.push('/404')
    }

    processRoutes(location: Location) {
        this.pathParts = Array.from(location.pathname.match(/\/[a-z0-9]+/gi) || ['/'])
        if (paths.includes(this.pathParts[0]) && this.pathParts.length <= 2) {
            this.emit('ROUTE', this.pathParts[0] as Paths, { path: this.pathParts[1] })
        } else this.push404()
    }

    getQueries() {
        history.push({ search: '?q=4' })
    }
}
