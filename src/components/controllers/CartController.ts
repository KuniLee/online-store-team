import type { AppModelInstance } from '../models/model'
import { CartViewInstance } from '@/components/views/CartView'

export class CartController {
    private model: AppModelInstance
    private view: CartViewInstance

    constructor(model: AppModelInstance, view: CartViewInstance) {
        this.model = model
        this.view = view
    }
}
