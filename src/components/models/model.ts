import EventEmitter from 'events'
import { Paths } from '@/utils/Rooter'
import { getItems, getItem } from '@/utils/loader'
import { Filters, Item } from 'types/interfaces'

type AppModelEventsName = 'CHANGE_PAGE' | 'ITEM_REMOVE'
export type AppModelInstance = InstanceType<typeof AppModel>

export class AppModel extends EventEmitter {
    private currentPage: Paths | undefined
    private catalogItems: Array<Item> = []
    private catalogItemsFiltered: Array<Item> = []
    private cartItems: Array<Item> = []
    private filters: Filters = { category: {}, brand: {}, price: {}, stock: {} }

    constructor() {
        super()
    }

    changePage(page: Paths, args?: string) {
        this.currentPage = page
        console.log(this.currentPage)
        switch (page) {
            case '/':
                this.getItems().then(() => {
                    this.emit('CHANGE_PAGE', page)
                })
                break
            case '/item':
            case '/404':
                this.emit('CHANGE_PAGE', page, args)
                break
        }
    }

    async getItems() {
        if (!this.catalogItems.length) {
            try {
                this.catalogItems = await getItems()
            } catch (e) {
                console.log('error', e)
            }
        }
        this.catalogItems.forEach(({ category, brand, price, stock }) => {
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

    async getItem(article: number) {
        if (article) {
            try {
                const item = await getItem(article)
                return JSON.parse(JSON.stringify(item))[0]
            } catch (e) {
                console.error(e)
            }
        }
    }

    emit(event: AppModelEventsName, data?: Paths, article?: string) {
        return super.emit(event, data, article)
    }

    on(event: AppModelEventsName, callback: (data: Paths, args: { path: string }) => void) {
        return super.on(event, callback)
    }
}
