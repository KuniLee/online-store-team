import './styles/style.css'

import { Test } from 'types/interfaces'
import { getProducts } from '@/utils/loader'

let x: Test
x = {
    test: 'kek',
}
console.log('Hello online')
console.log(x)

x = {
    test: 'lol',
}

getProducts()
