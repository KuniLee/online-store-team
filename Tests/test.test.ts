import { CatalogView } from '@/components/views/CatalogView'
import { Item } from 'types/interfaces'
import {AppModel} from "@/components/models/model";
import {AppView} from "@/components/views/AppView";

class LocalStorageMock {
    private cartArticles: string;
    length: number;
    constructor() {
        this.cartArticles = '[{"article":1295042,"count":1},{"article":1294716,"count":1},{"article":1297914,"count":1},{"article":1295039,"count":1}]'
        this.length = 0
    }

    getItem(value: string) {
        switch (value) {
            case 'cartArticles':
                return JSON.stringify(this.cartArticles)
            case 'sumOfCart':
                return '123'
        }
        return null
    }

    setItem(value: string) {
        this.cartArticles = value
    }

    clear() {

        this.cartArticles = '[]'
    }

    key() {
        return '1' || null
    }

    removeItem() {
        return
    }
}

test('Find article in localStorage', () => {
    const model = new AppModel()
    global.localStorage = new LocalStorageMock;
    expect(model.checkItemInCart(1295042)).toBe(true)
    expect(model.checkItemInCart(129504)).toBe(false)
    localStorage.clear()
    expect(model.checkItemInCart(1295042)).toBe(false)
})
