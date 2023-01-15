/**
 * @jest-environment jsdom
 */
import {AppModel} from "@/components/models/model";
import Parse from "parse";
import * as dotenv from 'dotenv'
dotenv.config()
Parse.serverURL = 'https://parseapi.back4app.com' // This is your Server URL
Parse.initialize(process.env.BACK4APP_APP_ID || '', process.env.BACK4APP_JS_KEY)

test('Should return empty object', async () => {
  const model = new AppModel()
  model.on('CART_UPDATE', (data, args, cartObj) => {
    expect(cartObj).toStrictEqual({"count": 0, "price": 0})
  })
  await model.updateCartIcon()
})

test('Should return object with data', async () => {
  const model = new AppModel()
  await model.addToCart(1295039)
  model.on('CART_UPDATE', (data, args, cartObj) => {
    expect(cartObj).toStrictEqual({"count": 1, "price": 7350})
  })
  await model.updateCartIcon()
})
