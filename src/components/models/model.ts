import EventEmitter from 'events'
import { Paths } from '@/utils/Rooter'
import { getItems, getItem } from '@/utils/loader'
import { Item } from 'types/interfaces'

type AppModelEventsName = 'CHANGE_PAGE' | 'ITEM_REMOVE'
export type AppModelInstance = InstanceType<typeof AppModel>

export class AppModel extends EventEmitter {
    private currentPage: Paths | undefined
    private catalogItems: Array<Item> = []
    private catalogItemsFiltered: Array<Item> = []
    private cartItems: Array<Item> = []

    constructor() {
        super()
    }

    get items() {
        return this.catalogItems
    }

    changePage(page: Paths, args?: string) {
        this.currentPage = page
        switch (page) {
            case '/':
                this.getItems().then(() => {
                    this.emit('CHANGE_PAGE', page)
                })
                break
            case '/item':
            case '/404':
                this.emit('CHANGE_PAGE', page, args)
                break
        }
    }

    async getItems() {
        if (!this.catalogItems.length) {
            try {
                this.catalogItems = await getItems()
            } catch (e) {
                console.log('error', e)
            }
        }
    }

    async getItem(article: number) {
        if (article) {
            try {
                const item = await getItem(article)
                return JSON.parse(JSON.stringify(item))[0]
            } catch (e) {
                console.error(e)
            }
        }
    }

    emit(event: AppModelEventsName, data?: Paths, article?: string) {
        return super.emit(event, data, article)
    }

    on(event: AppModelEventsName, callback: (data: Paths, args: { path: string }) => void) {
        return super.on(event, callback)
    }
}
