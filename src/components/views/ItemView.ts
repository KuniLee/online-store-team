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
            photo1: `${object.images[0]}&fit=constrain`,
            photo2: `${object.images[1]}&fit=constrain`,
            photo3: `${object.images[2]}&fit=constrain`,
            photo4: `${object.images[3]}&fit=constrain`,
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
        const photosContainer = document.querySelector('.carousel-photo')
        const mainPhoto = document.querySelector('.main-photo')
        if (photosContainer && mainPhoto) {
            photosContainer.addEventListener('click', (event) => {
                const target = event.target as HTMLElement
                if (target.tagName === 'IMG') {
                    const imageSrc = target.getAttribute('src')
                    if (imageSrc) {
                        mainPhoto.setAttribute('src', imageSrc)
                    } else {
                        console.error('Cant copy URL')
                    }
                }
            })
        }
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
