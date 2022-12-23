import EventEmitter from 'events'
import { Pages } from '@/utils/Rooter'

type AppModelEventsName = 'CHANGE_PAGE' | 'ITEM_REMOVE'
export type AppModelInstance = InstanceType<typeof AppModel>

export class AppModel extends EventEmitter {
    private currentPage: Pages | undefined

    constructor() {
        super()
    }

    changePage(page: Pages, args?: string) {
        this.currentPage = page
        this.emit('CHANGE_PAGE', page)
    }

    emit(event: AppModelEventsName, data?: object | string) {
        return super.emit(event, data)
    }

    on(event: AppModelEventsName, callback: (data: object | string) => void) {
        return super.on(event, callback)
    }
}
