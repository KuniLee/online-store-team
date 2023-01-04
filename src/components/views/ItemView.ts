import EventEmitter from 'events'
import type { AppModelInstance } from '../models/model'
import itemTemplate from '@/templates/product_page.hbs'
import { Item } from 'types/interfaces'

type ItemViewEventsName = 'ITEM_BUTTON_CLICK' | 'ADD_TO_CART_CLICK'

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
        const dateObj = new Date(object.updatedAt)
        const date = `${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`
        this.container.innerHTML = itemTemplate({
            object,
            date: date,
            imageFirst: object.images[0],
        })
        const photosContainer = document.querySelector('.carousel-photo')
        const mainPhoto = document.querySelector('.main-photo')
        const mainPhotoContainer = document.querySelector('.main-photo-container') as HTMLElement
        if (photosContainer && mainPhoto) {
            photosContainer.addEventListener('click', (event) => {
                const target = event.target as HTMLElement
                if (target.tagName === 'IMG') {
                    const imageSrc = target.getAttribute('src')
                    if (imageSrc) {
                        mainPhoto.setAttribute('src', imageSrc)
                        mainPhotoContainer.setAttribute('style', `background-image: url('${imageSrc}'`)
                    } else {
                        console.error('Cant copy URL')
                    }
                }
            })
        }
        const listOfSmallPhoto = document.querySelectorAll('.small-photo')
        if (listOfSmallPhoto) {
            listOfSmallPhoto.forEach((el) => {
                if (el.getAttribute('src') === '') {
                    el.classList.add('hidden')
                }
                if (Number(el.getAttribute('data-index')) > 3) {
                    el.remove()
                }
            })
        }
        if (mainPhotoContainer) {
            mainPhotoContainer.onpointermove = function (e) {
                const target = e.currentTarget as HTMLElement
                const x = (e.offsetX / target.offsetWidth) * 100
                const y = (e.offsetY / target.offsetHeight) * 100
                target.style.backgroundPosition = `${x}% ${y}%`
            }
        }
        const addToCartButton = document.querySelector('.addToCartButton')
        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                this.emit('ADD_TO_CART_CLICK', {
                    article: object.article,
                    price: object.price,
                })
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

    emit(event: ItemViewEventsName, data: { article: number; price: number }) {
        return super.emit(event, data)
    }

    on(event: ItemViewEventsName, callback: (data: { article: number; price: number }) => void) {
        return super.on(event, callback)
    }
}
