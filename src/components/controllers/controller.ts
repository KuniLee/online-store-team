import type { AppModelInstance } from '../models/model'
import type { AppViewInstance } from '../views/view'
import { RouterInstance } from '@/utils/Rooter'

export class AppController {
    private model: AppModelInstance
    private view: AppViewInstance
    private router: RouterInstance

    constructor(model: AppModelInstance, view: AppViewInstance, router: RouterInstance) {
        this.model = model
        this.view = view
        this.router = router
        router.on('ROUTE', (location, args) => {
            console.log('route to ', location)
            if (location === 'item') console.log('args', args)
        })
        view.on('ITEM_BUTTON_CLICK', this.addItem)
        router.init()
        view.buildApp()
    }

    addItem() {
        this.model.addItem({ id: Math.random().toString(), name: 'Item' })
    }
}
