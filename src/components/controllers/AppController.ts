import type { AppModelInstance } from '../models/model'
import type { AppViewInstance } from '../views/AppView'
import { Paths, RouterInstance } from '@/utils/Rooter'
import { ApiRequests } from '@/utils/loader'

export class AppController {
    private model: AppModelInstance
    private view: AppViewInstance
    private router: RouterInstance
    private loader: ApiRequests

    constructor(model: AppModelInstance, view: AppViewInstance, router: RouterInstance, loader: ApiRequests) {
        this.model = model
        this.view = view
        this.router = router
        this.loader = loader
        router.on('ROUTE', async (page: Paths, args) => {
            console.log('route to ', page)
            const pathParts = Array.from(location.pathname.match(/[a-z0-9]+/gi) || ['/'])
            if (pathParts[0] === 'item') {
                const item = await this.loader.getItem(Number(pathParts[1]))
                const dataOfItem = JSON.parse(JSON.stringify(item))[0]
                console.log(dataOfItem)
                if (pathParts.length > 2 || dataOfItem === undefined) {
                    this.router.push('/404')
                    this.view.load404page()
                    return
                }
            }
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
