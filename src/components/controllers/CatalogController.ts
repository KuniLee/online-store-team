import type { AppModelInstance } from '../models/model'
import { CatalogViewInstance } from '@/components/views/CatalogView'

export class CatalogController {
    private model: AppModelInstance
    private view: CatalogViewInstance

    constructor(model: AppModelInstance, view: CatalogViewInstance) {
        this.model = model
        this.view = view
    }
}
