import EventEmitter from 'events'
import { DualSlider, Filter, FiltersSetting } from 'types/interfaces'
import dropdownTemplate from '@/templates/dropdownItem.hbs'
import noUiSlider from 'nouislider'
import { target } from 'nouislider'

type FiltersEventsName = 'FILTER_CHANGE'

export class Filters extends EventEmitter {
    private categoryFilter: Menu | undefined
    private brandFilter: Menu | undefined
    private totalEl: Element | null
    private priceFilter: Range | undefined
    private stockFilter: Range | undefined
    private sortEl: HTMLSelectElement | undefined
    private viewBtn: Button

    constructor(private container: HTMLElement, private settings: FiltersSetting) {
        super()
        this.totalEl = this.container.querySelector('#total')
        this.viewBtn = new Button(this.container.querySelector('#viewBtn'), this.onchangeView.bind(this))
        this.buildDropdowns()
        this.buildSorting()
        this.buildSearch()
    }

    emit(event: FiltersEventsName) {
        return super.emit(event)
    }

    on(event: FiltersEventsName, callback: () => void) {
        return super.on(event, callback)
    }

    rebuildFilters() {
        this.viewBtn.change(this.settings.view)
        this.categoryFilter?.setFields(this.settings.category)
        this.brandFilter?.setFields(this.settings.brand)
        this.priceFilter?.setFields(this.settings.price)
        this.stockFilter?.setFields(this.settings.stock)
        ;(this.totalEl as HTMLElement).textContent = this.settings.total.toString()
    }

    private buildDropdowns() {
        this.categoryFilter = new Menu(
            this.container.querySelector('#categoryFilter'),
            'category',
            this.onchangeMenu.bind(this)
        )
        this.brandFilter = new Menu(this.container.querySelector('#brandFilter'), 'brand', this.onchangeMenu.bind(this))
        this.priceFilter = new Range(
            this.container.querySelector('#priceFilter'),
            this.settings.price,
            'price',
            this.onchangeRange.bind(this)
        )
        this.stockFilter = new Range(
            this.container.querySelector('#stockFilter'),
            this.settings.stock,
            'stock',
            this.onchangeRange.bind(this)
        )
    }

    onchangeView(data: DataFromFilter) {
        if (typeof data.state === 'string') {
            this.settings.view = data.state
        }
        this.emit('FILTER_CHANGE')
    }

    onchangeMenu(data: DataFromFilter) {
        // @ts-ignore
        this.settings[data.id][data.name].check = data.state
        this.emit('FILTER_CHANGE')
    }

    onchangeRange(data: DataFromFilter) {
        // @ts-ignore
        this.settings[data.id].current = data.state
        this.emit('FILTER_CHANGE')
    }

    private buildSorting() {
        this.sortEl = document.querySelector('#sort') as HTMLSelectElement
        this.sortEl.selectedIndex = ['price:ASC', 'price:DESC', 'sold:ASC', 'sold:DESC'].indexOf(this.settings.sort) + 1
        this.sortEl.addEventListener('change', () => {
            if (this.sortEl && this.sortEl.selectedIndex)
                this.settings.sort = this.sortEl.options[this.sortEl.selectedIndex].value
            else this.settings.sort = ''
            this.emit('FILTER_CHANGE')
        })
    }

    private buildSearch() {
        const searchEl = document.querySelector('#search') as HTMLInputElement
        if (this.settings.search) searchEl.value = this.settings.search
        searchEl.addEventListener('input', () => {
            if (searchEl.value !== '') this.settings.search = searchEl.value
            else this.settings.search = null
            this.emit('FILTER_CHANGE')
        })
    }
}

class Dropdown {
    public button: HTMLElement | undefined | null
    protected dropdownMenu: HTMLElement | undefined | null
    private arrow: SVGSVGElement | undefined | null
    public isOpen = false

    constructor(
        private el: HTMLElement | null,
        protected name: string,
        protected callback: (data: DataFromFilter) => void
    ) {
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

class Range extends Dropdown {
    private readonly sliderEl: target

    constructor(
        el: HTMLElement | null,
        setting: DualSlider,
        name: keyof FiltersSetting,
        callback: (data: DataFromFilter) => void
    ) {
        super(el, name, callback)
        this.sliderEl = document.createElement('div')
        noUiSlider.create(this.sliderEl, {
            start: [setting.min, setting.max],
            tooltips: [true, true],
            connect: true,
            step: 10,
            margin: 10,
            range: {
                min: setting.min,
                '70%': [3000],
                max: setting.max,
            },
        })
        this.sliderEl.noUiSlider?.on('change', (ev) => {
            const data: [number, number] = [+ev[0], +ev[1]]
            this.callback({ id: this.name, state: data })
        })
        this.dropdownMenu?.append(this.sliderEl)
    }

    setFields(fields: DualSlider) {
        if (fields.current) this.sliderEl.noUiSlider?.set(fields.current)
    }
}

class Menu extends Dropdown {
    constructor(el: HTMLElement | null, name: keyof FiltersSetting, callback: (data: DataFromFilter) => void) {
        super(el, name, callback)
    }

    setFields(fields: Filter) {
        const container = document.createElement('fieldset')
        Object.keys(fields)
            .sort()
            .forEach((field) => {
                container.insertAdjacentHTML(
                    'beforeend',
                    dropdownTemplate({ id: this.name, name: field, body: fields[field] })
                )
            })
        ;(this.dropdownMenu as HTMLElement).innerHTML = ''
        this.dropdownMenu?.append(container)
    }
}

type DataFromFilter = {
    id: string
    name?: string
    state?: boolean | [number, number] | string
}

class Button {
    private state = 'cols'
    constructor(public element: Element | null, protected callback: (data: DataFromFilter) => void) {
        this.element?.addEventListener('click', () => {
            if (this.state === 'list') {
                this.callback({ id: 'view', state: 'cols' })
                return
            }
            if (this.state === 'cols') {
                this.callback({ id: 'view', state: 'list' })
                return
            }
        })
    }

    change(state: string) {
        this.state = state
        if (state === 'list') {
            this.element?.firstElementChild?.classList.add('hidden')
            this.element?.lastElementChild?.classList.remove('hidden')
        }
        if (state === 'cols') {
            this.element?.firstElementChild?.classList.remove('hidden')
            this.element?.lastElementChild?.classList.add('hidden')
        }
    }
}
