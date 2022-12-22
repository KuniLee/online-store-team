import type { AppModelInstance } from '../models/model'
import type { AppViewInstance } from '../views/view'

export class AppController {
    constructor(model: AppModelInstance, view: AppViewInstance) {
        this.model = model
        this.view = view

        view.on('ITEM_BUTTON_CLICK', this.addItem)
    }

    private model: AppModelInstance
    private view: AppViewInstance

    addItem() {
        this.model.addItem({ id: Math.random().toString(), name: 'Item' })
    }
}
