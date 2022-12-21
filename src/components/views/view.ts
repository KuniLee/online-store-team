import EventEmitter from 'events'
import { ItemsModel } from '../models/model'
import type { ItemsModelInstance } from '../models/model'

type ItemViewEventsName = 'ITEM_BUTTON_CLICK'

export type ItemsViewInstance = InstanceType<typeof ItemsView>

type ItemsViewElements = {
    container: HTMLDivElement
    button: HTMLButtonElement
}

export class ItemsView extends EventEmitter {
    constructor(model: ItemsModelInstance, appContainer: Element) {
        super()

        this.model = model
        // this.elements = elements

        model.on('ITEM_ADD', this.rebuildList)
        model.on('ITEM_REMOVE', this.rebuildList)

        // elements.button.addEventListener('click', () => {
        //     this.emit('ITEM_BUTTON_CLICK')
        // })
    }

    private model: ItemsModelInstance
    private elements?: Record<string, HTMLElement>

    emit(event: ItemViewEventsName) {
        return super.emit(event)
    }

    on(event: ItemViewEventsName, callback: () => void) {
        return super.on(event, callback)
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
