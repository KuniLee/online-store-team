import EventEmitter from 'events'
import type { AppModelInstance } from '../models/model'
import itemTemplate from '@/templates/product_page.hbs'
import breadTemplate from '@/templates/Breadcrumb.hbs'
import { Item } from 'types/interfaces'

type ItemViewEventsName = 'ITEM_BUTTON_CLICK'

export type ItemViewInstance = InstanceType<typeof ItemView>

export class ItemView extends EventEmitter {
    private container: HTMLElement
    private model: AppModelInstance

    constructor(model: AppModelInstance, container: HTMLElement) {
        super()
        this.model = model
        this.container = container
    }

    build(object: Item) {
        const fragmentBread = document.createElement('template')
        const dateObj = new Date(object.updatedAt)
        const date = `${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`
        this.container.innerHTML = itemTemplate({
            name: object.title,
            price: object.price,
            photo1: object.images[0],
            photo2: object.images[1],
            photo3: object.images[2],
            photo4: object.images[3],
            article: object.article,
            category: object.category,
            brand: object.brand,
            stock: object.stock,
            updateAt: date,
            description: object.description,
        })
        fragmentBread.innerHTML = breadTemplate({
            brandBread: object.brand,
            titleBread: object.title,
        })
        this.container.prepend(fragmentBread.content)
        document.querySelectorAll('.main-photo').forEach((el) => {
            if (el.getAttribute('src') === '') {
                el.classList.add('hidden')
            }
        })
        const dropMenu = document.querySelector('.drop-menu')
        if (dropMenu) {
            dropMenu.addEventListener('click', () => {
                dropMenu.classList.toggle('h-[68px]')
                const arrow = dropMenu.querySelector('.svg')
                if (arrow) {
                    arrow.classList.toggle('rotate-180')
                }
            })
        }
    }

    emit(event: ItemViewEventsName) {
        return super.emit(event)
    }

    on(event: ItemViewEventsName, callback: () => void) {
        return super.on(event, callback)
    }
}
