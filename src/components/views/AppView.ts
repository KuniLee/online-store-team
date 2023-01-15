import EventEmitter from 'events'
import type { AppModelInstance } from '../models/model'
import headerTemplate from '@/templates/header.hbs'
import footer from '@/templates/footer.hbs'
import notFoundTemplate from '@/templates/error_404.html'

type ItemViewEventsName = 'CART_BUTTON_CLICK' | 'LOGO_CLICK'

export type AppViewInstance = InstanceType<typeof AppView>

export class AppView extends EventEmitter {
    private container: HTMLElement
    private model: AppModelInstance
    private readonly mainPageContainer: HTMLElement

    constructor(model: AppModelInstance, appContainer: HTMLElement) {
        super()
        this.model = model
        this.container = appContainer
        this.mainPageContainer = document.createElement('main')
        this.mainPageContainer.className = 'flex-grow flex-auto'

        model.on('CHANGE_PAGE', (page) => {
            if (page === '/404') this.load404page()
        })
        model.on('CART_UPDATE', (_, args, cartObj) => {
            this.cartIconUpdate(cartObj)
        })
    }

    emit(event: ItemViewEventsName) {
        return super.emit(event)
    }

    on(event: ItemViewEventsName, callback: () => void) {
        return super.on(event, callback)
    }

    addListeners() {
        this.container.querySelector('.cart-button')?.addEventListener('click', () => {
            this.emit('CART_BUTTON_CLICK')
        })
        this.container.querySelector('.header__top-logo')?.addEventListener('click', (ev) => {
            ev.preventDefault()
            this.emit('LOGO_CLICK')
        })
    }

    buildApp() {
        const fragment = document.createElement('template')
        const fragmentFooter = document.createElement('template')
        const fragmentHeader = document.createElement('template')
        const localStorageSum = localStorage.getItem('sumOfCart')
        const localStorageArrayWithData = localStorage.getItem('cartArticles')
        let sumOfPrices = 0
        let countOfItems = 0
        if (localStorageSum) {
            sumOfPrices = Number(localStorageSum)
        }
        if (localStorageArrayWithData) {
            const parsedArray = JSON.parse(localStorageArrayWithData)
            for (const obj of parsedArray) {
                countOfItems += obj.count
            }
        }

        fragmentFooter.innerHTML = footer({
            year: new Date().getFullYear(),
            img: require('@/assets/images/rs_school_js.svg'),
        })
        fragmentHeader.innerHTML = headerTemplate({
            sum: sumOfPrices,
            numbOfItems: countOfItems,
            img: require('@/assets/images/logo.svg'),
        })
        fragment.content.append(this.mainPageContainer, fragmentFooter.content)
        fragment.content.prepend(fragmentHeader.content)
        this.container.append(fragment.content)

        this.addListeners()

        return this.mainPageContainer
    }

    cartIconUpdate(cartObj: { count: number; price: number }) {
        const countItemCart = document.querySelector('.cartIconCount')
        const sumOfPriceCart = document.querySelector('.sumOfItems')
        if (countItemCart && sumOfPriceCart) {
            if (countItemCart.textContent) {
                countItemCart.textContent = String(cartObj.count)
                sumOfPriceCart.textContent = String(cartObj.price)
            }
        }
    }

    load404page() {
        this.mainPageContainer.innerHTML = notFoundTemplate
    }
}
