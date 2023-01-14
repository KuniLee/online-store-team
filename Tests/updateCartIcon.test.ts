/**
 * @jest-environment jsdom
 */
import {AppModel} from "@/components/models/model";
import Parse from "parse";

Parse.serverURL = 'https://parseapi.back4app.com' // This is your Server URL
Parse.initialize('bTBI54NNgMYOcu9Wek7gtUaNxzcRZTdOMsCKnSDa', 'JuP0m3MeXtiTZALU5meiuTob4wbVOBOCe2F6raSa')

const model = new AppModel()


test('Item with right article add to localStorage', async () => {
  await model.addToCart(1320369)
  const array = [{'article':1320369, 'count':1}]
  expect(localStorage.getItem('cartArticles')).toBe(JSON.stringify(array))
  await model.addToCart(1323455)
  array.push({'article':1323455, 'count':1})
  expect(localStorage.getItem('cartArticles')).toBe(JSON.stringify(array))
})

test('Item with wrong article dont add to localStorage', async () => {
  await model.addToCart(13)
  const array = [{'article':1320369, 'count':1},{'article':1323455, 'count':1}]
  expect(localStorage.getItem('cartArticles')).toBe(JSON.stringify(array))
})

test('Dont add same item twice', async () => {
  await model.addToCart(1320369)
  const array = [{'article':1320369, 'count':1}]
  expect(localStorage.getItem('cartArticles')).toBe(JSON.stringify(array))
  await model.addToCart(1320369)
  expect(localStorage.getItem('cartArticles')).toBe(JSON.stringify(array))
})
