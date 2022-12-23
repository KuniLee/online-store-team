import EventEmitter from 'events'
import type { AppModelInstance } from '../models/model'
import catalogTemplate from '@/templates/catalog.html'

type CatalogViewEventsName = 'ITEM_BUTTON_CLICK'

export type CatalogViewInstance = InstanceType<typeof CatalogView>

export class CatalogView extends EventEmitter {
    private container: HTMLElement
    private model: AppModelInstance

    constructor(model: AppModelInstance, container: HTMLElement) {
        super()
        this.model = model
        this.container = container
        model.on('CHANGE_PAGE', (page) => {
            if (page === 'catalog') this.build()
        })
    }

    build() {
        this.container.innerHTML = catalogTemplate
    }

    emit(event: CatalogViewEventsName) {
        return super.emit(event)
    }

    on(event: CatalogViewEventsName, callback: () => void) {
        return super.on(event, callback)
    }
}
