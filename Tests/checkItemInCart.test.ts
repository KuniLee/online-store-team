import { CatalogView } from '@/components/views/CatalogView'
import { Item } from 'types/interfaces'
import {AppModel} from "@/components/models/model";
import {AppView} from "@/components/views/AppView";
import {LocalStorageMock} from "./localStorageMock";


test('Find article in localStorage', () => {
    const model = new AppModel()
    global.localStorage = new LocalStorageMock;
    expect(model.checkItemInCart(1295042)).toBe(true)
    expect(model.checkItemInCart(129504)).toBe(false)
    localStorage.clear()
    expect(model.checkItemInCart(1295042)).toBe(false)
})
