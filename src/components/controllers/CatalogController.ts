import type { AppModelInstance } from '../models/model'
import { CatalogViewInstance } from '@/components/views/CatalogView'
import { Router } from '@/utils/Rooter'

export class CatalogController {
    constructor(private model: AppModelInstance, private view: CatalogViewInstance, private router: Router) {
        // model.on('CHANGE_PAGE', (page) => {
        //     if (page === '/')
        //        this.model.setFilters(this.router.getQueries())
        //         //this.router.getQueries()
        // })
    }
}
