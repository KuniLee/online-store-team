import EventEmitter from 'events'
import type { AppModelInstance } from '../models/model'
import itemTemplate from '@/templates/product_page.html'

type ItemViewEventsName = 'ITEM_BUTTON_CLICK'

export type ItemViewInstance = InstanceType<typeof ItemView>

export class ItemView extends EventEmitter {
    private container: HTMLElement
    private model: AppModelInstance

    constructor(model: AppModelInstance, container: HTMLElement) {
        super()
        this.model = model
        this.container = container
        model.on('CHANGE_PAGE', (page) => {
            if (page === 'item') this.build()
        })
    }

    build() {
        this.container.innerHTML = itemTemplate
    }

    emit(event: ItemViewEventsName) {
        return super.emit(event)
    }

    on(event: ItemViewEventsName, callback: () => void) {
        return super.on(event, callback)
    }
}
