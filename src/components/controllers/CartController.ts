import type { AppModelInstance } from '../models/model'
import { CartViewInstance } from '@/components/views/CartView'
import { Paths, RouterInstance } from '@/utils/Rooter'

export class CartController {
    private model: AppModelInstance
    private view: CartViewInstance
    private router: RouterInstance

    constructor(model: AppModelInstance, view: CartViewInstance, router: RouterInstance) {
        this.model = model
        this.view = view
        this.router = router
        model.on('CHANGE_PAGE', async (page: Paths) => {
            if (page === '/cart') {
                const localStorageArray = localStorage.getItem('cartArticles')
                if (localStorageArray) {
                    const arrayWithData = JSON.parse(localStorageArray)
                    const arrayWithArticles = arrayWithData.map(
                        (item: { article: string; count: number }) => item.article
                    )
                    const items = await this.model.getItemsByArticles(arrayWithArticles)
                    const search = new URLSearchParams(window.location.search)
                    if (search.get('quickBuy')) {
                        this.view.build(items, true)
                    } else {
                        this.view.build(items)
                    }
                } else {
                    this.view.build()
                }
            }
        })
        this.view.on('ADD_QUERY', () => {
            const page = document.querySelector('.cartPageQuery')?.textContent
            const limitField = document.querySelector('.cartLimitQuery') as HTMLInputElement
            const limitValue = limitField?.value
            if (page && limitValue) {
                const str = {
                    limit: limitValue,
                    page: page,
                }
                const sp = new URLSearchParams(str)
                this.router.setQueries(String(sp))
            }
            this.view.updateCart()
        })
        this.view.on('ENTER_PROMOCODE', async (data) => {
            const result = await this.model.checkPromo(data)
            if (result) {
                this.view.updatePriceWithDiscount(result.Discount, data)
            } else {
                this.view.updatePriceWithDiscount()
            }
        })
        this.view.on('CHANGE_PAGE_QUERY_PLUS', () => {
            const pageField = document.querySelector('.cartPageQuery')
            const itemsCount = document.querySelectorAll('.cartItem').length
            const limitField = document.querySelector('.cartLimitQuery') as HTMLInputElement
            const limitValue = limitField?.value
            if (pageField) {
                const maxItems = (Number(pageField.textContent) + 1) * Number(limitValue)
                if (maxItems < itemsCount + Number(limitValue)) {
                    const pageCount = String(Number(pageField.textContent) + 1)
                    this.updateQuery(limitValue, pageCount)
                    this.view.updateLimitAndPageFields(Number(pageCount), Number(limitValue))
                }
            }
        })
        this.view.on('CHANGE_PAGE_QUERY_MINUS', () => {
            const pageField = document.querySelector('.cartPageQuery')
            if (pageField) {
                if (pageField.textContent === '1') {
                    return
                } else {
                    const pageCount = String(Number(pageField.textContent) - 1)
                    const limitField = document.querySelector('.cartLimitQuery') as HTMLInputElement
                    const limitValue = limitField?.value
                    this.updateQuery(limitValue, pageCount)
                    this.view.updateLimitAndPageFields(Number(pageCount), Number(limitValue))
                }
            }
        })
        this.view.on('CHANGE_PAGE_QUERY_LIMIT', () => {
            const pageField = document.querySelector('.cartPageQuery')
            const cartLimitField = document.querySelector('.cartLimitQuery') as HTMLInputElement
            const cartItems = document.querySelectorAll('.cartItem')
            const newLimit = cartLimitField.value
            const maxPage = Math.ceil(cartItems.length / Number(newLimit))
            let pageCount = Number(pageField?.textContent)
            if (maxPage === 0) {
                this.view.build()
            }
            if (maxPage < Number(pageCount)) {
                if (pageField) {
                    if (pageCount !== 1) {
                        pageCount = maxPage
                    }
                }
            }
            if (pageField) {
                this.updateQuery(newLimit, String(pageCount) ?? '1')
            }
            this.view.updateLimitAndPageFields(Number(pageCount), Number(newLimit))
            this.view.updateCart()
        })
        this.view.on('BUTTON_BUY_CLICK', () => {
            this.view.modalWindowOpen()
        })
        this.view.on('SUCCESS_BUY', () => {
            this.view.successBuy()
        })
        this.view.on('CART_CHANGE', async (article?: string) => {
            const totalSum = article ? await this.model.changeCart(article) : await this.model.changeCart()
            this.view.updateCartInformation(Number(totalSum))
        })
        this.view.on('CART_ITEM_CLICK', (article: string) => {
            this.router.push(`item/${article}`)
        })
    }

    updateQuery(limitCount: string, pageCount: string) {
        const str = {
            limit: limitCount,
            page: pageCount,
        }
        const sp = new URLSearchParams(str)
        this.router.setQueries(String(sp))
        this.view.updateCart()
    }
}
