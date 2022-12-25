import type { AppModelInstance } from '../models/model'
import type { AppViewInstance } from '../views/AppView'
import { Paths, RouterInstance } from '@/utils/Rooter'

export class AppController {
    private model: AppModelInstance
    private view: AppViewInstance
    private router: RouterInstance

    constructor(model: AppModelInstance, view: AppViewInstance, router: RouterInstance) {
        this.model = model
        this.view = view
        this.router = router
        router.on('ROUTE', (page: Paths, args) => {
            console.log('route to ', page)
            // TODO: проверка есть ли такой товар, если на item
            this.model.changePage(page, args)
        })
        view.on('CART_BUTTON_CLICK', () => {
            this.router.push('/cart')
        })
        view.on('LOGO_CLICK', () => {
            this.router.push('/')
        })
        router.init()
    }
}
