import EventEmitter from 'events'
import type { AppModelInstance } from '../models/model'
import catalogTemplate from '@/templates/catalog.html'
import { Filters, Item } from 'types/interfaces'
import cardTemplate from '@/templates/itemMain.hbs'
import noUiSlider from 'nouislider'
import { target } from 'nouislider'

type CatalogViewEventsName = 'ITEM_BUTTON_CLICK' | 'GO_TO_ITEM'

export type CatalogViewInstance = InstanceType<typeof CatalogView>

export class CatalogView extends EventEmitter {
    private container: HTMLElement
    private model: AppModelInstance
    private items: Array<Item> = []
    private filters: Filters = { category: {}, brand: {}, price: {}, stock: {} }

    constructor(model: AppModelInstance, container: HTMLElement) {
        super()
        this.model = model
        this.container = container
        this.model.on('CHANGE_PAGE', (page, { search }) => {
            if (page === '/') {
                console.log('search', search)
                this.setFilters()
                this.build()
                this.items = this.model.items
                this.rebuildCards()
            }
        })
    }

    build() {
        this.container.innerHTML = catalogTemplate
        const slider = this.container.querySelector('#slider') as target
        if (slider) {
            noUiSlider.create(slider, {
                start: [20, 80],
                tooltips: [true, true],
                connect: true,
                step: 10,
                margin: 10,
                range: {
                    min: 0,
                    max: 100,
                },
            })
            slider.noUiSlider?.on('change', (ev) => {
                console.log(ev)
            })
        }
    }

    emit(event: CatalogViewEventsName, arg: string) {
        return super.emit(event, arg)
    }

    on(event: CatalogViewEventsName, callback: (arg: string) => void) {
        return super.on(event, callback)
    }

    private rebuildCards() {
        const cardContainer = this.container.querySelector('#items')
        for (let i = 0; i < 30; i++) {
            const card = document.createElement('div')
            card.innerHTML = cardTemplate({ ...this.items[i], big: !((i + 1) % 7) })
            cardContainer?.append(...card.childNodes)
        }
        cardContainer?.addEventListener('click', (event) => {
            event.preventDefault()
            const link = event.composedPath().find((el) => (el as HTMLElement).tagName === 'A')
            if (link) this.emit('GO_TO_ITEM', new URL((link as HTMLAnchorElement).href).pathname)
        })
    }

    private setFilters() {
        this.model.items.forEach(({ category, brand, price, stock }) => {
            // calculate categories total
            if (!this.filters.category[category]) this.filters.category[category] = { total: 0, count: 0 }
            // calculate categories brands
            if (!this.filters.brand[brand]) this.filters.brand[brand] = { total: 0, count: 0 }

            if (!this.filters.price.min || this.filters.price.min > price) this.filters.price.min = price
            if (!this.filters.price.max || this.filters.price.max < price) this.filters.price.max = price
            if (!this.filters.stock.min || this.filters.stock.min > price) this.filters.stock.min = stock
            if (!this.filters.stock.max || this.filters.stock.max < price) this.filters.stock.max = stock

            this.filters.brand[brand].total++
            this.filters.category[category].total++
        })
        console.log(this.filters)
    }
}
