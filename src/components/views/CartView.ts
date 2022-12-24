import EventEmitter from 'events'
import type { AppModelInstance } from '../models/model'
import cartTemplate from '@/templates/cart.html'

type CartViewEventsName = 'ITEM_BUTTON_CLICK'

export type CartViewInstance = InstanceType<typeof CartView>

export class CartView extends EventEmitter {
    private container: HTMLElement
    private model: AppModelInstance

    constructor(model: AppModelInstance, container: HTMLElement) {
        super()
        this.model = model
        this.container = container
        model.on('CHANGE_PAGE', (page) => {
            if (page === '/cart') this.build()
        })
    }

    build() {
        this.container.innerHTML = cartTemplate
    }

    emit(event: CartViewEventsName) {
        return super.emit(event)
    }

    on(event: CartViewEventsName, callback: () => void) {
        return super.on(event, callback)
    }
}
