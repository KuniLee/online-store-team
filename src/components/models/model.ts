import EventEmitter from 'events'
import { Paths } from '@/utils/Rooter'

type AppModelEventsName = 'CHANGE_PAGE' | 'ITEM_REMOVE'
export type AppModelInstance = InstanceType<typeof AppModel>

export class AppModel extends EventEmitter {
    private currentPage: Paths | undefined

    constructor() {
        super()
    }

    changePage(page: Paths, args?: string) {
        this.currentPage = page
        this.emit('CHANGE_PAGE', page)
    }

    emit(event: AppModelEventsName, data?: Paths) {
        return super.emit(event, data)
    }

    on(event: AppModelEventsName, callback: (data: Paths) => void) {
        return super.on(event, callback)
    }
}
