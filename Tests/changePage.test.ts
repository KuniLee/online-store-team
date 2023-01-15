/**
 * @jest-environment jsdom
 */
import { AppModel } from '@/components/models/model'
import Parse from 'parse'
import * as dotenv from 'dotenv'
import { Paths } from '@/utils/Rooter'

const getItemsMocked = jest.spyOn(AppModel.prototype, 'getItems')
const emitMocked = jest.spyOn(AppModel.prototype, 'emit')

dotenv.config()

Parse.serverURL = 'https://parseapi.back4app.com' // This is your Server URL
Parse.initialize(process.env.BACK4APP_APP_ID || '', process.env.BACK4APP_JS_KEY)
const model = new AppModel()

beforeEach(() => {
    getItemsMocked.mockClear()
    emitMocked.mockClear()
})

const pages = ['/item', '/cart', '/404']

test('changePage on Main', () => {
    const page = '/'
    model.changePage(page)
    expect(model.currentPage).toBe(page)
    expect(getItemsMocked).toHaveBeenCalled()
})

describe('changePage on other pages', () => {
    pages.forEach((page) => {
        test(`changePage on ${page}`, () => {
            model.changePage(page as Paths)
            expect(model.currentPage).toBe(page)
            expect(emitMocked).toHaveBeenCalledWith('CHANGE_PAGE', page, undefined)
        })
    })
})
