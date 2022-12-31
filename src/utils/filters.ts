import EventEmitter from 'events'
import { Filter, FiltersSetting } from 'types/interfaces'
import dropdownTemplate from '@/templates/dropdownItem.hbs'

type FiltersEventsName = 'FILTER_CHANGE'

export class Filters extends EventEmitter {
    private categoryFilter: Menu | undefined
    private brandFilter: Menu | undefined
    private totalEl: Element | null

    constructor(private container: HTMLElement, private settings: FiltersSetting) {
        super()
        this.totalEl = this.container.querySelector('#total')
        this.buildDropdowns()
    }

    emit(event: FiltersEventsName) {
        return super.emit(event)
    }

    on(event: FiltersEventsName, callback: () => void) {
        return super.on(event, callback)
    }

    rebuildFilters() {
        this.categoryFilter?.setFields(this.settings.category, 'category')
        this.brandFilter?.setFields(this.settings.brand, 'brand')
        ;(this.totalEl as HTMLElement).textContent = this.settings.total.toString()
    }

    private buildDropdowns() {
        this.categoryFilter = new Menu(this.container.querySelector('#categoryFilter'), this.onchange.bind(this))
        this.brandFilter = new Menu(this.container.querySelector('#brandFilter'), this.onchange.bind(this))
    }

    onchange(data: DataFromFilter) {
        // @ts-ignore
        this.settings[data.id][data.name].check = data.state
        this.emit('FILTER_CHANGE')
    }
}

class Dropdown {
    public button: HTMLElement | undefined | null
    protected dropdownMenu: HTMLElement | undefined | null
    private arrow: SVGSVGElement | undefined | null
    public isOpen = false

    constructor(private el: HTMLElement | null, protected callback: (data: DataFromFilter) => void) {
        this.button = el?.querySelector('button')
        this.arrow = this.button?.querySelector('svg')
        this.dropdownMenu = el?.querySelector('.dropdownMenu')
        this.el?.addEventListener('mouseover', () => {
            this.open()
        })
        this.el?.addEventListener('mouseleave', () => {
            this.hide()
        })
        this.dropdownMenu?.addEventListener('change', (ev) => {
            const [name, field] = (ev.target as HTMLInputElement).id.split(':')
            const check = (ev.target as HTMLInputElement).checked
            if (field) this.callback({ id: name, name: field, state: check })
        })
    }

    open() {
        this.dropdownMenu?.classList.remove('hidden')
        this.arrow?.classList.remove('rotate-180')
        this.isOpen = true
    }

    hide() {
        this.dropdownMenu?.classList.add('hidden')
        this.arrow?.classList.add('rotate-180')
        this.isOpen = false
    }
}

class Menu extends Dropdown {
    constructor(el: HTMLElement | null, callback: (data: DataFromFilter) => void) {
        super(el, callback)
    }

    setFields(fields: Filter, name: keyof FiltersSetting) {
        const container = document.createElement('fieldset')
        Object.keys(fields)
            .sort()
            .forEach((field) => {
                container.insertAdjacentHTML(
                    'beforeend',
                    dropdownTemplate({ id: name, name: field, body: fields[field] })
                )
            })
        ;(this.dropdownMenu as HTMLElement).innerHTML = ''
        this.dropdownMenu?.append(container)
    }
}

type DataFromFilter = {
    id: string
    name: string
    state: boolean
}
