import EventEmitter from 'events'
import { Paths } from '@/utils/Rooter'
import { checkPromocode, getItem, getItems, getItemsByTag } from '@/utils/loader'
import { Item } from 'types/interfaces'

type AppModelEventsName = 'CHANGE_PAGE' | 'ITEM_REMOVE' | 'ITEM_ADDED_TO_CART'
export type AppModelInstance = InstanceType<typeof AppModel>

export class AppModel extends EventEmitter {
    public currentPage: Paths | undefined
    private catalogItems: Array<Item> = []

    constructor() {
        super()
    }

    get items() {
        return this.catalogItems
    }

    changePage(page: Paths, args?: { path: string; search: string }) {
        this.currentPage = page
        console.log(this.currentPage)
        switch (page) {
            case '/':
                this.getItems().then(() => {
                    this.emit('CHANGE_PAGE', page, args)
                })
                break
            case '/item':
            case '/404':
            case '/cart':
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

    async getItemsByArticles(articles: Array<number>) {
        if (articles) {
            try {
                return await getItemsByTag('article', articles)
            } catch (er) {
                console.error(er)
            }
        }
    }

    addToCart(object: { article: number; price: number }) {
        console.log(object)
        const localStorageItem = localStorage.getItem('cartArticles')
        const localStorageSum = localStorage.getItem('sumOfCart')
        const objectWithItemData = {
            article: object.article,
            count: 1,
        }
        if (!localStorageSum) {
            localStorage.setItem('sumOfCart', '0')
        }
        if (localStorageItem) {
            const articlesArray = JSON.parse(localStorageItem)
            for (const item of articlesArray) {
                if (JSON.stringify(item) === JSON.stringify(objectWithItemData)) {
                    return
                }
            }
            articlesArray.push(objectWithItemData)
            localStorage.setItem('cartArticles', JSON.stringify(articlesArray))
            const sum = String(Number(localStorage.getItem('sumOfCart')) + object.price)
            localStorage.setItem('sumOfCart', sum)
            this.emit('ITEM_ADDED_TO_CART', undefined, { price: object.price })
        } else {
            const articlesArray = [objectWithItemData]
            localStorage.setItem('cartArticles', JSON.stringify(articlesArray))
            localStorage.setItem('sumOfCart', String(object.price))
            this.emit('ITEM_ADDED_TO_CART', undefined, { price: object.price })
        }
    }
    async checkPromo(data: string) {
        if (data) {
            try {
                const result = await checkPromocode(data)
                return JSON.parse(JSON.stringify(result))[0]
            } catch (er) {
                console.error(er)
            }
        }
    }

    emit(event: AppModelEventsName, data?: Paths, args?: { path?: string; search?: string; price?: number }) {
        return super.emit(event, data, args)
    }

    on(
        event: AppModelEventsName,
        callback: (data: Paths, args: { path: string; search: string; price: number }) => void
    ) {
        return super.on(event, callback)
    }
}
