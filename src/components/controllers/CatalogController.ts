import type { AppModelInstance } from '../models/model'
import { CatalogViewInstance } from '@/components/views/CatalogView'
import { Router } from '@/utils/Rooter'

export class CatalogController {
    constructor(private model: AppModelInstance, private view: CatalogViewInstance, private router: Router) {
        this.view.on('GO_TO_ITEM', (path) => {
            this.router.push(path)
        })
    }
}
