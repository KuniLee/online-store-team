/**
 * @jest-environment jsdom
 */
import { AppModel } from '@/components/models/model'
import Parse from 'parse'
import * as dotenv from 'dotenv'

dotenv.config()

Parse.serverURL = 'https://parseapi.back4app.com' // This is your Server URL
Parse.initialize(process.env.BACK4APP_APP_ID || '', process.env.BACK4APP_JS_KEY)

const model = new AppModel()

test('Delete item from localStorage', async () => {
    await model.addToCart(1320369)
    const array = [{ article: 1320369, count: 1 }]
    expect(localStorage.getItem('cartArticles')).toBe(JSON.stringify(array))
    await model.deleteFromCart(1320369)
    array.pop()
    expect(localStorage.getItem('cartArticles')).toBe(JSON.stringify(array))
})

test("Doesn't remove items not found", async () => {
    await model.addToCart(1320369)
    const array = [{ article: 1320369, count: 1 }]
    expect(localStorage.getItem('cartArticles')).toBe(JSON.stringify(array))
    await model.deleteFromCart(132036)
    expect(localStorage.getItem('cartArticles')).toBe(JSON.stringify(array))
})
