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
                    this.view.build(items)
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
                    pageField.textContent = String(Number(pageField.textContent) + 1)
                    const str = {
                        limit: limitValue,
                        page: pageField.textContent,
                    }
                    const sp = new URLSearchParams(str)
                    this.router.setQueries(String(sp))
                    this.view.updateCart()
                }
            }
        })
        this.view.on('CHANGE_PAGE_QUERY_MINUS', () => {
            const pageField = document.querySelector('.cartPageQuery')
            if (pageField) {
                if (pageField.textContent === '1') {
                    return
                } else {
                    pageField.textContent = String(Number(pageField.textContent) - 1)
                    const limitField = document.querySelector('.cartLimitQuery') as HTMLInputElement
                    const limitValue = limitField?.value
                    const str = {
                        limit: limitValue,
                        page: pageField.textContent,
                    }
                    const sp = new URLSearchParams(str)
                    this.router.setQueries(String(sp))
                    this.view.updateCart()
                }
            }
        })
        this.view.on('CHANGE_PAGE_QUERY_LIMIT', () => {
            const pageField = document.querySelector('.cartPageQuery')
            const cartLimitField = document.querySelector('.cartLimitQuery') as HTMLInputElement
            const cartItems = document.querySelectorAll('.cartItem')
            const newLimit = cartLimitField.value
            const maxPage = Math.ceil(cartItems.length / Number(newLimit))
            if (maxPage === 0) {
                this.view.build()
            }
            if (maxPage < Number(pageField?.textContent)) {
                console.log(1)
                if (pageField) {
                    if (pageField.textContent !== '1') {
                        pageField.textContent = String(maxPage)
                    }
                }
            }
            if (pageField) {
                const str = {
                    limit: newLimit,
                    page: pageField.textContent ?? '1',
                }
                const sp = new URLSearchParams(str)
                this.router.setQueries(String(sp))
            }
            this.view.updateCart()
        })
        this.view.on('BUTTON_BUY_CLICK', () => {
            this.view.modalWindowOpen()
        })
        this.view.on('SUCCESS_BUY', () => {
            this.view.successBuy()
        })
    }
}
