import Parse from 'parse'

Parse.serverURL = 'https://parseapi.back4app.com' // This is your Server URL
// Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
Parse.initialize(process.env.BACK4APP_APP_ID || '', process.env.BACK4APP_JS_KEY)

export async function getProducts() {
    const query: Parse.Query = new Parse.Query('Products')
    try {
        const results: Parse.Object[] = await query.find()
        for (const object of results) {
            // Access the Parse Object attributes using the .GET method
            const price: string = object.get('price')
            const desc: string = object.get('desc')
            const images: string = object.get('images')
            const title: string = object.get('title')
            const category: string = object.get('category')
            const brand: string = object.get('brand')
            const stock: string = object.get('stock')
            console.log(object.id)
            console.log(price)
            console.log(desc)
            console.log(images)
            console.log(title)
            console.log(category)
            console.log(brand)
            console.log(stock)
        }
    } catch (error: any) {
        console.error('Error while fetching Products', error)
    }
}
