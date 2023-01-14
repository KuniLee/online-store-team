import { CatalogView } from '@/components/views/CatalogView'
import { Item } from 'types/interfaces'
import {AppModel} from "@/components/models/model";
import {AppView} from "@/components/views/AppView";
import {LocalStorageMock} from "./localStorageMock";

const model = new AppModel()
global.localStorage = new LocalStorageMock;

test('Should return true when item in localStorage', () => {
    expect(model.checkItemInCart(1295042)).toBe(true)
})

test('Should return false when localStorage dont include article', () => {
    expect(model.checkItemInCart(129504)).toBe(false)
})

test('Should return false after delete item', () => {
    localStorage.clear()
    expect(model.checkItemInCart(1295042)).toBe(false)
})
