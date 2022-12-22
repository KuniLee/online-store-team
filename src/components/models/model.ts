import EventEmitter from 'events'

type Item = {
    id: string
    name: string
}

type AppModelEventsName = 'ITEM_ADD' | 'ITEM_REMOVE'
export type AppModelInstance = InstanceType<typeof AppModel>

export class AppModel extends EventEmitter {
    constructor(items?: Item[]) {
        super()
        this.items = items || []
    }

    private items: Item[]

    emit(event: AppModelEventsName, data?: object | string) {
        return super.emit(event)
    }

    on(event: AppModelEventsName, callback: () => void) {
        return super.on(event, callback)
    }

    getItems() {
        return [...this.items]
    }

    addItem(item: Item) {
        this.items.push(item)
        this.emit('ITEM_ADD')
    }

    removeItem(id: string) {
        this.items = this.items.filter((item) => id !== item.id)
        this.emit('ITEM_REMOVE')
    }
}
