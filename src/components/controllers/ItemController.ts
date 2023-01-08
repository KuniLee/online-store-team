import type { AppModelInstance } from '../models/model'
import { ItemViewInstance } from '@/components/views/ItemView'
import { Paths, RouterInstance } from '@/utils/Rooter'

export class ItemController {
    private model: AppModelInstance
    private view: ItemViewInstance
    private router: RouterInstance

    constructor(model: AppModelInstance, view: ItemViewInstance, router: RouterInstance) {
        this.model = model
        this.view = view
        this.router = router
        model.on('CHANGE_PAGE', async (page: Paths, args) => {
            if (args?.path && page === '/item') {
                const item = await this.model.getItem(Number.parseInt(args?.path.slice(1)))
                const pathPattern = location.pathname.match(/\w+\/\d{7}$/gm)
                if (!item || !pathPattern) this.router.push('/404')
                else this.view.build(item)
            }
        })
        this.view.on('ADD_TO_CART_CLICK', (article: number, isQuickBuy: boolean) => {
            const resultOfCheckItem = this.model.checkItemInCart(article)
            if (!isQuickBuy) {
                if (resultOfCheckItem) {
                    this.model.deleteFromCart(article)
                } else {
                    this.model.addToCart(article)
                }
            }
            if (isQuickBuy && !resultOfCheckItem) {
                this.model.addToCart(article)
            }
        })
        this.view.on('CHECK_ITEM_IN_CART', (article: number) => {
            const resultOfCheckItem = this.model.checkItemInCart(article)
            this.view.changeButtonAddToCart(resultOfCheckItem)
        })
        this.view.on('QUICK_BUY', (article: number) => {
            this.router.push('/cart?quickBuy=true')
        })
    }
}
