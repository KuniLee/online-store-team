import type { AppModelInstance } from '../models/model'
import { ItemViewInstance } from '@/components/views/ItemView'

export class ItemController {
    private model: AppModelInstance
    private view: ItemViewInstance

    constructor(model: AppModelInstance, view: ItemViewInstance) {
        this.model = model
        this.view = view
    }
}
