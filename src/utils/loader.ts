import Parse from 'parse'

// export async function getProducts() {
//     const query: Parse.Query = new Parse.Query('Products')
//     try {
//         const results: Parse.Object[] = await query.find()
//         for (const object of results) {
//             // Access the Parse Object attributes using the .GET method
//             const price: string = object.get('price')
//             const desc: string = object.get('desc')
//             const images: string = object.get('images')
//             const title: string = object.get('title')
//             const category: string = object.get('category')
//             const brand: string = object.get('brand')
//             const stock: string = object.get('stock')
//             console.log(object.id)
//             console.log(price)
//             console.log(desc)
//             console.log(images)
//             console.log(title)
//             console.log(category)
//             console.log(brand)
//             console.log(stock)
//         }
//     } catch (error: unknown) {
//         console.error('Error while fetching Products', error)
//     }
// }

export class ApiRequests {
    async getItems() {
        Parse.serverURL = 'https://parseapi.back4app.com' // This is your Server URL
        Parse.initialize(process.env.BACK4APP_APP_ID || '', process.env.BACK4APP_JS_KEY)
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
        } catch (error: unknown) {
            console.error('Error while fetching Products', error)
        }
    }
    async getItem(article: number) {
        Parse.serverURL = 'https://parseapi.back4app.com' // This is your Server URL
        Parse.initialize('bTBI54NNgMYOcu9Wek7gtUaNxzcRZTdOMsCKnSDa' || '', 'JuP0m3MeXtiTZALU5meiuTob4wbVOBOCe2F6raSa')
        const query: Parse.Query = new Parse.Query('Products')
        query.equalTo('article', article)
        try {
            const results: Parse.Object[] = await query.find()
            return results
        } catch (error: unknown) {
            console.error('Error while fetching Products', error)
        }
    }
}
