import type { ItemsModelInstance } from '../models/model'
import type { ItemsViewInstance } from '../views/view'

export class ItemsController {
    constructor(model: ItemsModelInstance, view: ItemsViewInstance) {
        this.model = model
        this.view = view

        view.on('ITEM_BUTTON_CLICK', this.addItem)
    }

    private model: ItemsModelInstance
    private view: ItemsViewInstance

    addItem() {
        this.model.addItem({ id: Math.random().toString(), name: 'Item' })
    }
}
