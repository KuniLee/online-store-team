import EventEmitter from 'events'
import type { AppModelInstance } from '../models/model'
import catalogTemplate from '@/templates/catalog.html'
import { Item } from 'types/interfaces'
import cardTemplate from '@/templates/itemMain.hbs'

type CatalogViewEventsName = 'ITEM_BUTTON_CLICK'

export type CatalogViewInstance = InstanceType<typeof CatalogView>

export class CatalogView extends EventEmitter {
    private container: HTMLElement
    private model: AppModelInstance
    private items: Array<Item> = []

    constructor(model: AppModelInstance, container: HTMLElement) {
        super()
        this.model = model
        this.container = container
        model.on('CHANGE_PAGE', (page, args) => {
            if (page === '/') {
                this.build()
                this.items = model.items
                this.rebuildCards()
            }
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

    private rebuildCards() {
        const cardContainer = this.container.querySelector('#items')
        for (let i = 0; i < 30; i++) {
            const card = document.createElement('div')
            card.innerHTML = cardTemplate({ ...this.items[i], big: !((i + 1) % 7) })
            cardContainer?.append(...card.childNodes)
        }
    }
}
