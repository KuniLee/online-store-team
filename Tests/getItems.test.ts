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

test('get array of Items', async () => {
    await model.getItems()
    const items = model.items
    expect(Array.isArray(items)).toBeTruthy()
    expect(items.some((item) => item.id === 'QASkGFmJGf')).toBeTruthy()
})
