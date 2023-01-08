import EventEmitter from 'events'
import { Paths } from '@/utils/Rooter'
import { checkPromocode, getItem, getItems, getItemsByTag } from '@/utils/loader'
import { Item } from 'types/interfaces'

type AppModelEventsName = 'CHANGE_PAGE' | 'ITEM_REMOVE' | 'CART_UPDATE' | 'ITEM_ADDED'
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

    async addToCart(article: number) {
        if (this.catalogItems.length === 0) {
            await this.getItems()
        }
        const object = this.catalogItems.find((element: Item) => element.article === article)
        console.log(this.catalogItems)
        if (object) {
            const localStorageItem = localStorage.getItem('cartArticles')
            const localStorageSum = localStorage.getItem('sumOfCart')
            const objectWithItemData = {
                article: object.article,
                count: 1,
            }
            if (!localStorageSum) {
                localStorage.setItem('sumOfCart', '0')
            }
            if (localStorageItem && !this.checkItemInCart(object.article)) {
                const articlesArray = JSON.parse(localStorageItem)
                articlesArray.push(objectWithItemData)
                localStorage.setItem('cartArticles', JSON.stringify(articlesArray))
                const sum = String(Number(localStorage.getItem('sumOfCart')) + object.price)
                localStorage.setItem('sumOfCart', sum)
            } else {
                const articlesArray = [objectWithItemData]
                localStorage.setItem('cartArticles', JSON.stringify(articlesArray))
                localStorage.setItem('sumOfCart', String(object.price))
            }
            console.log(article)
            this.updateCartIcon()
            this.emit('ITEM_ADDED')
        }
    }

    updateCartIcon() {
        const items = localStorage.getItem('cartArticles')
        const sum = localStorage.getItem('sumOfCart')
        if (items) {
            const arrayWithItems = JSON.parse(items)
            const results = arrayWithItems.reduce(
                (acc: { count: number; price: number }, el: { article: number; count: number }) => {
                    const itemFromCatalog = this.catalogItems.find((element: Item) => element.article === el.article)
                    if (itemFromCatalog) {
                        acc.count += el.count
                        acc.price += itemFromCatalog.price * el.count
                    }
                    return acc
                },
                {
                    count: 0,
                    price: 0,
                }
            )
            this.emit('CART_UPDATE', undefined, undefined, results)
        } else {
            this.emit('CART_UPDATE', undefined, undefined, { count: 0, price: 0 })
        }
    }

    checkItemInCart(article: number) {
        const localStorageItem = localStorage.getItem('cartArticles')
        if (localStorageItem) {
            const articlesArray = JSON.parse(localStorageItem)
            for (const item of articlesArray) {
                if (item.article === article) {
                    return true
                }
            }
        }
        return false
    }

    deleteFromCart(article: number) {
        const localStorageArray = localStorage.getItem('cartArticles')
        const localStorageSum = localStorage.getItem('sumOfCart')
        if (localStorageArray && localStorageSum) {
            const countOfItemsHeader = document.querySelector('.countOfItems')

            const tempArray = JSON.parse(localStorageArray)
            for (let i = 0; i < tempArray.length; i++) {
                if (article === tempArray[i].article) {
                    const deletedItem = tempArray.splice(i, 1)
                    const itemObject = this.catalogItems.find((element) => element.article === article)
                    if (itemObject) {
                        localStorage.setItem(
                            'sumOfCart',
                            String(Number(localStorageSum) - Number(itemObject.price) * Number(deletedItem[0].count))
                        )
                    }
                    break
                }
            }
            if (countOfItemsHeader) {
                countOfItemsHeader.textContent = tempArray.length
            }
            localStorage.setItem('cartArticles', JSON.stringify(tempArray))
            this.updateCartIcon()
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

    async changeCart(articleToDelete?: string) {
        if (this.catalogItems.length === 0) {
            await this.getItems()
        }
        const cartItems = document.querySelectorAll('.cartItem')
        const itemsLocalStorage = localStorage.getItem('cartArticles') ?? ''
        let itemsArray = JSON.parse(itemsLocalStorage)
        let totalPrice = 0
        if (cartItems.length > 0) {
            cartItems.forEach((el) => {
                const element = el as HTMLElement
                const itemArticle = Number(element.dataset.article)
                const item = this.catalogItems.find((element) => element.article === itemArticle)
                const count = el.querySelector('.countNumber')?.textContent
                if (item && count) {
                    totalPrice += item.price * Number(count)
                    let indexToDelete = undefined
                    for (let i = 0; i < itemsArray.length; i++) {
                        if (articleToDelete) {
                            if (itemsArray[i].article === Number(articleToDelete)) {
                                indexToDelete = i
                            }
                        }
                        if (itemsArray[i].article === itemArticle) {
                            itemsArray[i].count =
                                itemsArray[i].count === count ? Number(itemsArray[i].count) : Number(count)
                        }
                    }
                    console.log(indexToDelete, articleToDelete)
                    if (articleToDelete && indexToDelete !== undefined) {
                        itemsArray.splice(indexToDelete, 1)
                    }
                }
            })
        } else {
            itemsArray = []
            localStorage.setItem('sumOfCart', String(0))
        }
        localStorage.setItem('cartArticles', JSON.stringify(itemsArray))
        localStorage.setItem('sumOfCart', String(totalPrice))
        this.updateCartIcon()
        return totalPrice
    }

    emit(
        event: AppModelEventsName,
        data?: Paths,
        args?: { path?: string; search?: string },
        cartObj?: { count: number; price: number }
    ) {
        return super.emit(event, data, args, cartObj)
    }

    on(
        event: AppModelEventsName,
        callback: (
            data: Paths,
            args: { path: string; search: string },
            cartObj: { count: number; price: number }
        ) => void
    ) {
        return super.on(event, callback)
    }
}
