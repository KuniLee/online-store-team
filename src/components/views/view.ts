import EventEmitter from 'events'
import type { AppModelInstance } from '../models/model'
import headerTemplate from '@/templates/header.html'
import footer from '@/templates/footer.hbs'
import header from '@/templates/header.html'

type ItemViewEventsName = 'ITEM_BUTTON_CLICK'

export type AppViewInstance = InstanceType<typeof AppView>

export class AppView extends EventEmitter {
    private container: HTMLElement
    private model: AppModelInstance
    private elements?: Record<string, HTMLElement>

    constructor(model: AppModelInstance, appContainer: HTMLElement) {
        super()
        this.model = model
        this.container = appContainer
        // this.elements = elements
        model.on('ITEM_ADD', this.rebuildList)
        model.on('ITEM_REMOVE', this.rebuildList)

        // elements.button.addEventListener('click', () => {
        //     this.emit('ITEM_BUTTON_CLICK')
        // })
    }

    emit(event: ItemViewEventsName) {
        return super.emit(event)
    }

    on(event: ItemViewEventsName, callback: () => void) {
        return super.on(event, callback)
    }

    buildApp() {
        const fragment = document.createElement('template')
        const fragmentFooter = document.createElement('template')
        const fragmentHeader = document.createElement('template')
        fragment.innerHTML = '<main class="flex-grow"></main>'
        fragmentFooter.innerHTML = footer({
            year: new Date().getFullYear(),
            img: require('@/assets/images/rs_school_js.svg'),
        })
        fragmentHeader.innerHTML = headerTemplate
        fragment.content.append(fragmentFooter.content)
        fragment.content.prepend(fragmentHeader.content)
        this.container.append(fragment.content)
    }

    rebuildList = () => {
        if (this.elements?.container) {
            const div = document.createElement('div')

            div.innerText = this.model
                .getItems()
                .map((item) => item.id)
                .join(' ')
            this.elements.container.appendChild(div)
        }
    }
}
