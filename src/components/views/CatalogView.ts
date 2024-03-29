import EventEmitter from 'events'
import type { AppModelInstance } from '../models/model'
import catalogTemplate from '@/templates/catalog.html'
import { FiltersSetting, Item } from 'types/interfaces'
import cardTemplate from '@/templates/itemCard.hbs'
import cardTemplateList from '@/templates/itemList.hbs'
import queryString from 'query-string'
import { Filters } from '@/utils/filters'

type CatalogViewEventsName =
    | 'ADD_ITEM_TO_CART'
    | 'GO_TO_ITEM'
    | 'CHANGE_FILTER'
    | 'RESET_FILTER'
    | 'COPY_FILTER'
    | 'REMOVE_ITEM_FROM_CART'

export type CatalogViewInstance = InstanceType<typeof CatalogView>

export class CatalogView extends EventEmitter {
    private container: HTMLElement
    private model: AppModelInstance
    private items: Array<Item> = []
    private filters: Filters | undefined
    private settings: FiltersSetting = {
        category: {},
        brand: {},
        price: { min: 0, max: 0 },
        stock: { min: 0, max: 0 },
        total: 0,
        search: null,
        sort: '',
        view: '',
    }
    private filteredItems: Array<Item> = []
    private shownCards = 0

    constructor(model: AppModelInstance, container: HTMLElement) {
        super()
        this.model = model
        this.container = container
        this.model.on('CHANGE_PAGE', (page, { search }) => {
            if (page === '/') {
                this.items = this.model.items
                this.setFilters(search)
                this.build()
                this.filterItems()
                this.sortItems()
                this.filters?.rebuildFilters()
                this.rebuildCards()
                this.addScrollLoader()
            }
            this.filters?.on('FILTER_CHANGE', () => {
                this.shownCards = 0
                this.filterItems()
                this.sortItems()
                this.rebuildCards()
                this.filters?.rebuildFilters()
            })
        })
    }

    build() {
        this.container.innerHTML = catalogTemplate
        const itemsContainer = this.container.querySelector('#items')
        const filterContainer = this.container.querySelector('#filters') as HTMLElement

        if (itemsContainer)
            itemsContainer.addEventListener('click', (event) => {
                event.preventDefault()
                const link = event.composedPath().find((el) => (el as HTMLElement).tagName === 'A')
                if (link) this.emit('GO_TO_ITEM', new URL((link as HTMLAnchorElement).href).pathname)
            })

        this.filters = new Filters(filterContainer, this.settings)
        ;(filterContainer.querySelector('#cleanBtn') as HTMLButtonElement).onclick = () => {
            this.shownCards = 0
            this.emit('RESET_FILTER')
        }
        const copyBnt = filterContainer.querySelector('#copyFiltersBtn') as HTMLButtonElement
        copyBnt.onclick = () => {
            this.emit('COPY_FILTER')
            copyBnt.firstElementChild?.classList.add('hidden')
            copyBnt.lastElementChild?.classList.remove('hidden')
            setTimeout(() => {
                copyBnt.firstElementChild?.classList.remove('hidden')
                copyBnt.lastElementChild?.classList.add('hidden')
            }, 1000)
        }
    }

    sortItems() {
        if (this.settings.sort !== '') {
            const funcArr: Array<string> = this.settings.sort.split(':').filter((el, idx) => idx < 2)
            const sortField: keyof Item = funcArr[0] as keyof Item
            const sortFunc = funcArr[1]
            if (sortFunc === 'ASC')
                this.filteredItems = this.filteredItems.sort(
                    (a, b) => (a[sortField] as number) - (b[sortField] as number)
                )
            if (sortFunc === 'DESC')
                this.filteredItems = this.filteredItems.sort(
                    (a, b) => (b[sortField] as number) - (a[sortField] as number)
                )
        }
    }

    filterItems() {
        this.resetFilterCounters()
        let brands = Object.keys(this.settings.brand).filter((el) => this.settings.brand[el].check)
        if (!brands.length) brands = [...Object.keys(this.settings.brand)]
        let categories = Object.keys(this.settings.category).filter((el) => this.settings.category[el].check)
        if (!categories.length) categories = [...Object.keys(this.settings.category)]
        this.filteredItems = this.items.filter((item) => {
            let clause: boolean = brands.includes(item.brand) && categories.includes(item.category)
            if (this.settings.price.current) {
                const [minPrice, maxPrice] = this.settings.price.current
                clause = clause && item.price >= minPrice && item.price <= maxPrice
            }
            if (this.settings.stock.current) {
                const [minStock, maxStock] = this.settings.stock.current
                clause = clause && item.stock >= minStock && item.stock <= maxStock
            }
            if (this.settings.search) {
                const reg = new RegExp(this.settings.search, 'i')
                const searchIn = [item.article, item.description, item.title, item.price]
                clause = clause && searchIn.some((el) => reg.test(el.toString()))
            }

            if (clause) {
                this.settings.brand[item.brand].count++
                this.settings.category[item.category].count++
                this.settings.total++
                return true
            }
        })
        this.buildQueryString()
    }

    resetFilterCounters() {
        this.settings.total = 0
        Object.keys(this.settings.brand).forEach((el) => {
            this.settings.brand[el].count = 0
        })
        Object.keys(this.settings.category).forEach((el) => {
            this.settings.category[el].count = 0
        })
    }

    emit(event: CatalogViewEventsName, arg?: string | number) {
        return super.emit(event, arg)
    }

    on(event: CatalogViewEventsName, callback: (arg: string | number) => void) {
        return super.on(event, callback)
    }

    private rebuildCards() {
        const cardContainer = this.container.querySelector('#items') as HTMLElement
        if (this.settings.view === 'list') cardContainer.className = 'container mx-auto flex flex-col gap-3'
        else
            cardContainer.className =
                'container mx-auto grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5'

        if (cardContainer) cardContainer.innerHTML = ''

        let max
        if (this.shownCards === 0) {
            max = this.filteredItems.length > 10 ? 10 : this.filteredItems.length
            this.shownCards = max
        } else {
            if (this.filteredItems.length <= this.shownCards) {
                max = this.filteredItems.length
                this.shownCards = this.filteredItems.length
            } else max = this.shownCards
        }

        for (let i = 0; i < max; i++) {
            const item = this.filteredItems[i]
            cardContainer?.append(this.createCard(item, i, this.model.checkItemInCart(item.article)))
        }
        if (!this.filteredItems.length) {
            cardContainer?.insertAdjacentHTML(
                'afterbegin',
                `<div class="flex col-span-full text-center text-xl h-[150px] place-self-center">
                      <span class="self-center">Nothing found</span></div>`
            )
        }
    }

    private showMoreCards() {
        const cardContainer = this.container.querySelector('#items')

        if (this.shownCards < this.filteredItems.length) {
            const first = this.shownCards
            const last =
                this.filteredItems.length >= this.shownCards + 10 ? this.shownCards + 10 : this.filteredItems.length
            for (let i = first; i < last; i++) {
                const item = this.filteredItems[i]
                //console.log(this.createCard(item, i, this.model.checkItemInCart(item.article)))
                cardContainer?.appendChild(this.createCard(item, i, this.model.checkItemInCart(item.article)))
                this.shownCards++
            }
        }
    }

    createCard(item: Item, idx: number, added: boolean): Node {
        const card = document.createElement('div')
        if (this.settings.view === 'list') {
            card.innerHTML = cardTemplateList({
                ...item,
                added,
            })
        } else
            card.innerHTML = cardTemplate({
                ...item,
                big: !((idx + 1) % 7),
                added,
            })
        const addTCartBtn = card.querySelector('.toCartBtn')
        addTCartBtn?.addEventListener('click', () => {
            if (added) {
                addTCartBtn.lastElementChild?.classList.add('hidden')
                addTCartBtn.firstElementChild?.classList.remove('hidden')
                this.emit('REMOVE_ITEM_FROM_CART', item.article)
            } else {
                addTCartBtn.lastElementChild?.classList.remove('hidden')
                addTCartBtn.firstElementChild?.classList.add('hidden')
                this.emit('ADD_ITEM_TO_CART', item.article)
            }
        })
        return card.firstChild as Node
    }

    private setFilters(search: string) {
        const parsedSearch = queryString.parse(search, { arrayFormat: 'bracket-separator', arrayFormatSeparator: '|' })
        this.settings = {
            category: {},
            brand: {},
            price: { min: 0, max: 0 },
            stock: { min: 0, max: 0 },
            total: 0,
            search: null,
            sort: '',
            view: 'cols',
        }
        this.model.items.forEach(({ category, brand, price, stock }) => {
            // calculate categories total
            if (!this.settings.category[category])
                this.settings.category[category] = { total: 0, count: 0, check: false }
            if (parsedSearch.category?.includes(category)) this.settings.category[category].check = true
            // calculate categories brands
            if (!this.settings.brand[brand]) this.settings.brand[brand] = { total: 0, count: 0, check: false }
            if (parsedSearch.brand?.includes(brand)) this.settings.brand[brand].check = true

            if (!this.settings.price.min || this.settings.price.min > price) this.settings.price.min = price
            if (!this.settings.price.max || this.settings.price.max < price) this.settings.price.max = price
            if (!this.settings.stock.min || this.settings.stock.min > price) this.settings.stock.min = stock
            if (!this.settings.stock.max || this.settings.stock.max < price) this.settings.stock.max = stock

            this.settings.brand[brand].total++
            this.settings.category[category].total++
        })
        if (parsedSearch.price && Array.isArray(parsedSearch.price)) {
            this.settings.price.current = [Number(parsedSearch.price[0]), Number(parsedSearch.price[1])]
        }
        if (parsedSearch.stock && Array.isArray(parsedSearch.stock)) {
            this.settings.stock.current = [Number(parsedSearch.stock[0]), Number(parsedSearch.stock[1])]
        }

        if (parsedSearch.sort && typeof parsedSearch.sort === 'string') {
            if (['price:ASC', 'price:DESC', 'sold:ASC', 'sold:DESC'].includes(parsedSearch.sort))
                this.settings.sort = parsedSearch.sort
        }

        if (parsedSearch.search && typeof parsedSearch.search === 'string') {
            this.settings.search = parsedSearch.search
        }
        if (parsedSearch.view && typeof parsedSearch.view === 'string') {
            if (['list'].includes(parsedSearch.view)) this.settings.view = parsedSearch.view
        }
    }

    buildQueryString() {
        const query: {
            brand?: Array<string>
            category?: Array<string>
            price?: Array<string>
            stock?: Array<string>
            sort?: string
            search?: string
            view?: string
        } = {}
        for (const brandKey in this.settings.brand) {
            if (this.settings.brand[brandKey].check) {
                if (!('brand' in query)) query.brand = [brandKey]
                else query.brand?.push(brandKey)
            }
        }
        for (const categoryKey in this.settings.category) {
            if (this.settings.category[categoryKey].check) {
                if (!('category' in query)) query.category = [categoryKey]
                else query.category?.push(categoryKey)
            }
        }

        if (this.settings.price.current) {
            query.price = this.settings.price.current.map((el) => el.toString())
        }
        if (this.settings.stock.current) {
            query.stock = this.settings.stock.current.map((el) => el.toString())
        }

        if (this.settings.sort !== '') query.sort = this.settings.sort

        if (this.settings.search) query.search = this.settings.search

        if (this.settings.view !== 'cols') query.view = this.settings.view

        this.emit(
            'CHANGE_FILTER',
            queryString.stringify(query, {
                arrayFormat: 'bracket-separator',
                arrayFormatSeparator: '|',
            })
        )
    }

    private addScrollLoader() {
        function throttle(callee: () => void, timeout: number) {
            let timer: NodeJS.Timeout | null = null

            return function perform() {
                if (timer) return

                timer = setTimeout(() => {
                    callee()

                    clearTimeout(Number(timer))
                    timer = null
                }, timeout)
            }
        }

        const checkPosition = () => {
            if (this.model.currentPage !== '/') return
            const height = document.body.offsetHeight
            const screenHeight = window.innerHeight
            const scrolled = window.scrollY
            const threshold = height - screenHeight / 10
            const position = scrolled + screenHeight
            if (position >= threshold) this.showMoreCards()
        }

        window.addEventListener('scroll', throttle(checkPosition, 250))
        window.addEventListener('resize', throttle(checkPosition, 250))
    }
}
