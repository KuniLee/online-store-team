import type { AppModelInstance } from '../models/model'
import { CatalogViewInstance } from '@/components/views/CatalogView'
import { Router } from '@/utils/Rooter'

export class CatalogController {
    constructor(private model: AppModelInstance, private view: CatalogViewInstance, private router: Router) {
        this.view.on('GO_TO_ITEM', (path) => {
            this.router.push(path as string)
        })
        this.view.on('CHANGE_FILTER', (search) => {
            this.router.setQueries(search as string)
        })
        this.view.on('RESET_FILTER', () => {
            this.router.push('/')
        })
        this.view.on('COPY_FILTER', () => {
            navigator.clipboard.writeText(router.getURL())
        })
        this.view.on('ADD_ITEM_TO_CART', (article) => {
            this.model.addToCart(+article)
        })
        this.view.on('REMOVE_ITEM_FROM_CART', (article) => {
            this.model.deleteFromCart(+article)
        })
    }
}
