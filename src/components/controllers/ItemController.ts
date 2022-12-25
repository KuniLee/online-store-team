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
        model.on('CHANGE_PAGE', async (page) => {
            const pathParts = Array.from(location.pathname.match(/[a-z0-9]+/gi) || ['/'])
            const pathPattern = location.pathname.match(/\w+\/\d{7}$/gm)
            if (pathParts[0] === 'item') {
                const item = await this.model.getItem(Number(pathParts[1]))
                console.log(pathPattern)
                if (!pathPattern || !item) {
                    this.router.push('/404')
                } else {
                    this.view.build(item)
                }
            }
        })
    }
}
