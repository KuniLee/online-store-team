import EventEmitter from 'events'
import type { AppModelInstance } from '../models/model'
import catalogTemplate from '@/templates/catalog.html'
import { FiltersSetting, Item } from 'types/interfaces'
import cardTemplate from '@/templates/itemMain.hbs'
import noUiSlider from 'nouislider'
import { target } from 'nouislider'
import queryString from 'query-string'
import { Filters } from '@/utils/filters'

type CatalogViewEventsName = 'ITEM_BUTTON_CLICK' | 'GO_TO_ITEM'

export type CatalogViewInstance = InstanceType<typeof CatalogView>

export class CatalogView extends EventEmitter {
    private container: HTMLElement
    private model: AppModelInstance
    private items: Array<Item> = []
    private filters: Filters | undefined
    private settings: FiltersSetting = { category: {}, brand: {}, price: {}, stock: {}, total: 0 }
    private filteredItems: Array<Item> = []

    constructor(model: AppModelInstance, container: HTMLElement) {
        super()
        this.model = model
        this.container = container
        this.model.on('CHANGE_PAGE', (page, { search }) => {
            if (page === '/') {
                this.items = this.model.items
                this.setFilters(search)
                this.build()
                this.filterItems()
                this.filters?.rebuildFilters()
                this.rebuildCards()
            }
            this.filters?.on('FILTER_CHANGE', () => {
                this.filterItems()
                this.rebuildCards()
                this.filters?.rebuildFilters()
            })
        })
    }

    build() {
        this.container.innerHTML = catalogTemplate
        const itemsContainer = this.container.querySelector('#items')
        if (itemsContainer)
            itemsContainer.addEventListener('click', (event) => {
                event.preventDefault()
                const link = event.composedPath().find((el) => (el as HTMLElement).tagName === 'A')
                if (link) this.emit('GO_TO_ITEM', new URL((link as HTMLAnchorElement).href).pathname)
            })
        const slider = this.container.querySelector('#slider') as target
        const filterContainer = this.container.querySelector('#filters') as HTMLElement
        this.filters = new Filters(filterContainer, this.settings)
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

    filterItems() {
        this.resetFilterCounters()
        let brands = Object.keys(this.settings.brand).filter((el) => this.settings.brand[el].check)
        if (!brands.length) brands = [...Object.keys(this.settings.brand)]
        let categories = Object.keys(this.settings.category).filter((el) => this.settings.category[el].check)
        if (!categories.length) categories = [...Object.keys(this.settings.category)]
        this.filteredItems = this.items.filter((item) => {
            if (brands.includes(item.brand) && categories.includes(item.category)) {
                this.settings.brand[item.brand].count++
                this.settings.category[item.category].count++
                this.settings.total++
                return true
            }
        })
    }
    resetFilterCounters() {
        this.settings.total = 0
        Object.keys(this.settings.brand).forEach((el) => {
            this.settings.brand[el].count = 0
        })
        Object.keys(this.settings.category).forEach((el) => {
            this.settings.category[el].count = 0
        })
    }

    emit(event: CatalogViewEventsName, arg: string) {
        return super.emit(event, arg)
    }

    on(event: CatalogViewEventsName, callback: (arg: string) => void) {
        return super.on(event, callback)
    }

    private rebuildCards() {
        const cardContainer = this.container.querySelector('#items')
        if (cardContainer) cardContainer.innerHTML = ''

        const max = this.filteredItems.length > 10 ? 10 : this.filteredItems.length
        for (let i = 0; i < max; i++) {
            const card = document.createElement('div')
            card.innerHTML = cardTemplate({ ...this.filteredItems[i], big: !((i + 1) % 7) })
            cardContainer?.append(...card.childNodes)
        }
    }

    private setFilters(search: string) {
        const parsedSearch = queryString.parse(search, { arrayFormat: 'bracket-separator', arrayFormatSeparator: '|' })
        this.settings = { category: {}, brand: {}, price: {}, stock: {}, total: 0 }
        this.model.items.forEach(({ category, brand, price, stock }) => {
            // calculate categories total
            if (!this.settings.category[category])
                this.settings.category[category] = { total: 0, count: 0, check: false }
            if (parsedSearch.category?.includes(category)) this.settings.category[category].check = true
            // calculate categories brands
            if (!this.settings.brand[brand]) this.settings.brand[brand] = { total: 0, count: 0, check: false }
            if (parsedSearch.brand?.includes(brand)) this.settings.brand[brand].check = true

            if (!this.settings.price.min || this.settings.price.min > price) this.settings.price.min = price
            if (!this.settings.price.max || this.settings.price.max < price) this.settings.price.max = price
            if (!this.settings.stock.min || this.settings.stock.min > price) this.settings.stock.min = stock
            if (!this.settings.stock.max || this.settings.stock.max < price) this.settings.stock.max = stock

            this.settings.brand[brand].total++
            this.settings.category[category].total++
        })
        console.log(parsedSearch)
        console.log(this.settings)
    }
}
