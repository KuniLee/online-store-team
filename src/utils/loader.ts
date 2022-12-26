import Parse from 'parse'
import { Item } from 'types/interfaces'

Parse.serverURL = 'https://parseapi.back4app.com' // This is your Server URL
// Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
Parse.initialize(process.env.BACK4APP_APP_ID || '', process.env.BACK4APP_JS_KEY)

export async function getItems(): Promise<Array<Item>> {
    const query: Parse.Query = new Parse.Query('Products')
    try {
        query.limit(3000)
        const results: Parse.Object[] = await query.find()
        return results.map(({ id, attributes }) => ({ id, ...attributes } as Item))
    } catch (error: unknown) {
        throw Error('Error while fetching Products: ' + error)
    }
}

export async function getItem(article: number) {
    const query: Parse.Query = new Parse.Query('Products')
    query.equalTo('article', article)
    try {
        const results: Parse.Object[] = await query.find()
        return results
    } catch (error: unknown) {
        console.error('Error while fetching Products', error)
    }
}
