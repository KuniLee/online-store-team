import EventEmitter from 'events'
import type { AppModelInstance } from '../models/model'
import cartTemplate from '@/templates/cart.hbs'
import emptyCartTemplate from '@/templates/empty_cart.html'
import promoBlock from '@/templates/promocodeField.hbs'

type CartViewEventsName =
    | 'ITEM_BUTTON_CLICK'
    | 'ADD_QUERY'
    | 'CART_ITEM_CLICK'
    | 'ENTER_PROMOCODE'
    | 'CHANGE_PAGE_QUERY_PLUS'
    | 'CHANGE_PAGE_QUERY_MINUS'
    | 'CHANGE_PAGE_QUERY_LIMIT'
    | 'BUTTON_BUY_CLICK'
    | 'CLOSE_MODAL'
    | 'SUCCESS_BUY'

export type CartViewInstance = InstanceType<typeof CartView>
export type ItemData = {
    article?: number
    price?: number
    action?: string
    deleteCount?: number
    el?: Element
    e?: Event
}

export class CartView extends EventEmitter {
    private container: HTMLElement
    private model: AppModelInstance

    constructor(model: AppModelInstance, container: HTMLElement) {
        super()
        this.model = model
        this.container = container
    }

    build(items?: Parse.Attributes[], isQuickBuy?: boolean) {
        if (items?.length === 0 || items === undefined) {
            this.container.innerHTML = emptyCartTemplate
        } else {
            const query = new URLSearchParams(window.location.search)
            let limitValue: number | undefined
            let pageValue: number | undefined
            for (const [key, value] of query) {
                if (key === 'limit') {
                    limitValue = Number(value)
                }
                if (key === 'page') {
                    pageValue = Number(value)
                }
            }
            const itemsCount = items ? items.length : 0
            limitValue = limitValue ? limitValue : itemsCount
            pageValue = pageValue ? pageValue : 1
            const localStorageArrayWithData = localStorage.getItem('cartArticles')
            const copyOfItemsArray = []
            let totalPrice = 0
            if (localStorageArrayWithData && items) {
                const parsedArray = JSON.parse(localStorageArrayWithData)
                for (let i = 0; i < items.length; i++) {
                    const itemArticle = items[i].article
                    const count = parsedArray.find(
                        (obj: { article: number; count: number }) => obj.article === itemArticle
                    ).count
                    const newObj = Object.assign({}, items[i], { count: count })
                    totalPrice += items[i].price * count
                    copyOfItemsArray.push(newObj)
                }
            }
            this.container.innerHTML = cartTemplate({
                arrayOfArticles: copyOfItemsArray,
                limitValue: limitValue,
                pageValue: pageValue,
                countOfItems: itemsCount,
                totalPrice: totalPrice,
                bankSystemsSprite: require('@/assets/images/bank-sprite.png'),
            })
            if (isQuickBuy) {
                this.modalWindowOpen()
            }
            const cartItems = document.querySelectorAll('.cartItem')
            this.updateCart()
            cartItems?.forEach((el) => {
                el.addEventListener('click', (e) => {
                    this.emit('CART_ITEM_CLICK')
                    const target = e.target as HTMLElement
                    if (target.closest('.cartDeleteBtn')) {
                        this.deleteCartItem(el)
                    }
                    if (target.closest('.countContainer')) {
                        const countField = target.closest('.countContainer')?.querySelector('.countNumber')
                        const cartElement = target.closest('.cartItem') as HTMLElement
                        const article = cartElement.dataset.article
                        const price = cartElement.dataset.price
                        const cartPrice = cartElement.querySelector('.cartItemPrice')
                        if (target.dataset.action === 'minus') {
                            if (countField) {
                                if (Number(countField.textContent) - 1 <= 0) {
                                    this.deleteCartItem(el)
                                } else {
                                    const countResult = Number(countField.textContent) - 1
                                    countField.textContent = String(countResult)
                                    if (cartPrice && price) {
                                        cartPrice.textContent = String(Number(price) * countResult)
                                        this.updateCartInfo(Number(article), Number(price), 'minus')
                                    }
                                }
                            }
                        }
                        if (target.dataset.action === 'plus') {
                            if (countField) {
                                const countResult = Number(countField.textContent) + 1
                                countField.textContent = String(countResult)
                                if (cartPrice && price) {
                                    cartPrice.textContent = String(Number(price) * countResult)
                                    this.updateCartInfo(Number(article), Number(price), 'plus')
                                }
                            }
                        }
                    }
                })
            })
            const cartLimitField = document.querySelector('.cartLimitQuery') as HTMLInputElement
            cartLimitField?.addEventListener('change', () => {
                this.emit('CHANGE_PAGE_QUERY_LIMIT')
            })
            document.querySelector('.cartPageMinusBtn')?.addEventListener('click', () => {
                this.emit('CHANGE_PAGE_QUERY_MINUS')
            })
            document.querySelector('.cartPagePlusBtn')?.addEventListener('click', () => {
                this.emit('CHANGE_PAGE_QUERY_PLUS')
            })
            document.querySelector('.enterPromocode')?.addEventListener('click', () => {
                const promocodeField = document.querySelector('.promocodeInput') as HTMLInputElement
                const promocodeValue = promocodeField?.value
                console.log(promocodeValue)
                if (promocodeValue) {
                    this.emit('ENTER_PROMOCODE', promocodeValue)
                }
            })
            document.querySelector('.buyButton')?.addEventListener('click', () => {
                this.emit('BUTTON_BUY_CLICK')
            })
            document.querySelector('.modalAddressInput')?.addEventListener('input', () => {
                const inputElement = document.querySelector('.modalAddressInput') as HTMLInputElement
                const value = inputElement.value
                if (value) {
                    const match = value.split(' ')
                    if (match.length >= 3) {
                        let count = 0
                        match.forEach((el) => {
                            const str = el.replace(',', '')
                            console.log(str)
                            if (str.length < 5) {
                                count += 1
                            }
                        })
                        if (count === 0) {
                            inputElement.setCustomValidity('')
                        } else {
                            inputElement.setCustomValidity('Invalid address')
                        }
                    } else {
                        inputElement.setCustomValidity('Invalid address')
                    }
                }
            })
            document.querySelector('.cardNumber')?.addEventListener('input', () => {
                const field = document.querySelector('.cardNumber') as HTMLInputElement
                const sprite = document.querySelector('.systemsSprite') as HTMLElement
                if (field) {
                    const value = field.value
                    if (value[0] === '3') {
                        if (!sprite.classList.contains('express')) {
                            this.removeCardSystem(sprite)
                            sprite.classList.add('express')
                        }
                    } else if (value[0] === '4') {
                        if (!sprite.classList.contains('visa')) {
                            this.removeCardSystem(sprite)
                            sprite.classList.add('visa')
                        }
                    } else if (value[0] === '5') {
                        if (!sprite.classList.contains('masterCard')) {
                            this.removeCardSystem(sprite)
                            sprite.classList.add('masterCard')
                        }
                    } else {
                        this.removeCardSystem(sprite)
                    }
                    if (value.length > 16) {
                        field.value = value.slice(0, 16)
                    }
                    if (value.length < 16 || (value[0] !== '3' && value[0] !== '4' && value[0] !== '5')) {
                        field.setCustomValidity('Invalid card number')
                    } else {
                        field.setCustomValidity('')
                    }
                }
            })
            const fieldCardData = document.querySelector('.cardData') as HTMLInputElement
            fieldCardData.addEventListener('input', (event) => {
                const ev = event as InputEvent
                const field = document.querySelector('.cardData') as HTMLInputElement
                let value = field.value
                if (ev.inputType !== 'deleteContentBackward') {
                    if (value.match(/[^0-9/]/)) {
                        const reg = new RegExp('[^0-9/]+', 'g')
                        field.value = value.replace(reg, '')
                        value = field.value
                    }
                    if (value.length === 2) {
                        field.value += '/'
                    }
                    if (value.length > 5) {
                        field.value = value.slice(0, 5)
                    }
                }
                const arrayWithData = value.split('/')
                if (arrayWithData.length < 2 || arrayWithData[0].length < 2 || arrayWithData[1].length < 2) {
                    field.setCustomValidity('Error card data')
                }
                if (arrayWithData.length === 2) {
                    if (arrayWithData[0].length === 2 && arrayWithData[1].length === 2) {
                        const month = Number(arrayWithData[0])
                        const year = Number(arrayWithData[1])
                        const dateNow = new Date()
                        const yearNow = Number(String(dateNow.getFullYear()).slice(2, 4))
                        const monthNow = dateNow.getMonth()
                        if (month > 12 || yearNow > year || (yearNow < year && monthNow > monthNow)) {
                            field.setCustomValidity('Error card thru')
                        } else {
                            field.setCustomValidity('')
                        }
                    }
                }
            })
            document.querySelector('.modalCvvInput')?.addEventListener('input', () => {
                const field = document.querySelector('.modalCvvInput') as HTMLInputElement
                const value = field.value
                if (value === '') {
                    field.value = ''
                }
                if (value.match(/[^0-9/]/)) {
                    const reg = new RegExp('[^0-9/+-]+', 'i')
                    field.value = value.toString().replace(reg, '')
                }
                if (value.length > 3) {
                    field.value = value.slice(0, 3)
                }
                if (value.length < 3) {
                    field.setCustomValidity('Error card CVV')
                } else {
                    field.setCustomValidity('')
                }
            })
            document.querySelector('.modalForm')?.addEventListener('submit', (e) => {
                e.preventDefault()
                this.emit('SUCCESS_BUY')
            })
        }
    }

    updateCart() {
        const query = new URLSearchParams(window.location.search)
        const cartItems = document.querySelectorAll('.cartItem')
        let limitValue: number | undefined
        let pageValue: number | undefined
        for (const [key, value] of query) {
            if (key === 'limit') {
                limitValue = Number(value)
            }
            if (key === 'page') {
                pageValue = Number(value)
            }
        }
        const itemsCount = cartItems ? cartItems.length : 0
        limitValue = limitValue ? limitValue : itemsCount
        pageValue = pageValue ? pageValue : 1
        const itemToRemoveFromEnd = cartItems.length - Number(limitValue) - (Number(pageValue) - 1) * Number(limitValue)
        const itemToRemoveFromStart = Number(limitValue) * (Number(pageValue) - 1)
        for (let i = 0; i < itemsCount; i++) {
            if (i < itemToRemoveFromStart) {
                if (!cartItems[i].classList.contains('hidden')) {
                    cartItems[i].classList.add('hidden')
                }
            } else if (itemsCount - i <= itemToRemoveFromEnd) {
                if (!cartItems[i].classList.contains('hidden')) {
                    cartItems[i].classList.add('hidden')
                }
            } else if (cartItems[i].classList.contains('hidden')) {
                cartItems[i].classList.remove('hidden')
            }
        }
    }

    updatePriceWithDiscount(discount?: number, name?: string) {
        const promocodeField = document.querySelector('.promocodeInput') as HTMLInputElement
        if (discount && name) {
            if (promocodeField.classList.contains('border-black')) {
                promocodeField.classList.remove('border-black')
            }
            if (promocodeField.classList.contains('border-red')) {
                promocodeField.classList.remove('border-red')
            }
            promocodeField.classList.add('border-green-500')
            const discountField = document.querySelector('.cartDiscount')
            const totalPriceField = document.querySelector('.totalPriceCart')?.textContent
            const summaryField = document.querySelector('.priceCart')
            const totalDiscountFields = document.querySelectorAll('.promocodeBlock')
            const totalDiscountBlock = document.querySelector('.totalDiscount')
            let totalDisc = 0
            const disc = (Number(totalPriceField) * discount) / 100
            console.log(disc)
            if (totalDiscountFields) {
                for (const element of totalDiscountFields) {
                    const discount = element.querySelector('.cartDiscount')?.textContent
                    const promocodeName = element.querySelector('.promocodeName')?.textContent
                    if (promocodeName) {
                        if (promocodeName === name) {
                            return
                        }
                    }
                    if (discount) {
                        totalDisc += Number(discount)
                    }
                }
            }
            const blockFragment = document.createElement('template')
            blockFragment.innerHTML = promoBlock({
                promocodeName: name,
                discount: disc,
            })
            if (discountField && summaryField && totalDiscountBlock && totalPriceField) {
                totalDiscountBlock.after(blockFragment.content)
                summaryField.textContent = String(Number(totalPriceField) - totalDisc - disc)
                discountField.textContent = String(totalDisc + disc)
            }
        } else {
            if (promocodeField.classList.contains('border-black')) {
                promocodeField.classList.remove('border-black')
            }
            if (promocodeField.classList.contains('border-green-500')) {
                promocodeField.classList.remove('border-green-500')
            }
            promocodeField.classList.add('border-red-500')
        }
    }

    deleteCartItem(el: Element) {
        const element = el as HTMLElement
        const price = Number(element.querySelector('.cartItemPrice')?.textContent)
        const countOfElement = el.querySelector('.countNumber')?.textContent
        const count = countOfElement ? countOfElement : 1
        this.updateCartInfo(Number(element.dataset.article), price, 'delete', Number(count))
        el.remove()
        const items = document.querySelectorAll('.cartItem.hidden')
        const cartItems = document.querySelectorAll('.cartItem')
        if (items.length === cartItems.length) {
            const pageField = document.querySelector('.cartPageQuery')
            if (pageField?.textContent) {
                pageField.textContent = String(Number(pageField.textContent) - 1)
                this.emit('CHANGE_PAGE_QUERY_LIMIT')
            }
        }
    }
    updateCartInfo(article: number, price: number, action: string, deleteCount?: number) {
        const totalPriceCart = document.querySelector('.totalPriceCart')
        const finalPrice = document.querySelector('.priceCart')
        const discountCart = document.querySelector('.cartDiscount')
        const countOfItemsCartIcon = document.querySelector('.cartIconCount')
        const headerSum = document.querySelector('.sumOfItems')
        const countOfItem = deleteCount ? deleteCount : 1
        if (totalPriceCart && finalPrice && discountCart) {
            let sumOfPrices = Number(totalPriceCart.textContent)
            if (action === 'delete' || action === 'minus') {
                sumOfPrices -= price
            }
            if (action === 'plus') {
                sumOfPrices += price
            }
            const localStorageArrayWithData = localStorage.getItem('cartArticles')
            if (localStorageArrayWithData && (action === 'plus' || action === 'minus')) {
                const parsedArrayWithData = JSON.parse(localStorageArrayWithData)
                for (const obj of parsedArrayWithData) {
                    if (obj.article === article) {
                        if (action === 'plus') {
                            obj.count += 1
                        }
                        if (action === 'minus') {
                            obj.count -= 1
                        }
                    }
                }
                localStorage.setItem('cartArticles', JSON.stringify(parsedArrayWithData))
            }
            localStorage.setItem('sumOfCart', String(sumOfPrices))
            totalPriceCart.textContent = String(sumOfPrices)
            if (countOfItemsCartIcon) {
                if (action === 'delete' || action === 'minus') {
                    countOfItemsCartIcon.textContent = String(Number(countOfItemsCartIcon.textContent) - countOfItem)
                }
                if (action === 'plus') {
                    countOfItemsCartIcon.textContent = String(Number(countOfItemsCartIcon.textContent) + 1)
                }
            }
            if (headerSum) {
                headerSum.textContent = String(sumOfPrices)
            }
            finalPrice.textContent = String(sumOfPrices - Number(discountCart.textContent))
        }
        if (action === 'delete') {
            const localStorageArray = localStorage.getItem('cartArticles')
            if (localStorageArray) {
                const countOfItemsHeader = document.querySelector('.countOfItems')
                const tempArray = JSON.parse(localStorageArray)
                for (let i = 0; i < tempArray.length; i++) {
                    if (article === tempArray[i].article) {
                        tempArray.splice(i, 1)
                        break
                    }
                }
                if (countOfItemsHeader) {
                    countOfItemsHeader.textContent = tempArray.length
                }
                localStorage.setItem('cartArticles', JSON.stringify(tempArray))
            }
        }
    }

    removeCardSystem(element: HTMLElement) {
        if (element.classList.contains('visa')) {
            element.classList.remove('visa')
        }
        if (element.classList.contains('masterCard')) {
            element.classList.remove('masterCard')
        }
        if (element.classList.contains('express')) {
            element.classList.remove('express')
        }
    }
    modalWindowOpen() {
        const modalBlock = document.querySelector('.modalBlock')
        if (modalBlock) {
            modalBlock.classList.add('modal-open')
            modalBlock.addEventListener('click', (e) => {
                const target = e.target as HTMLElement
                if (target.tagName === 'SECTION') {
                    modalBlock.classList.remove('modal-open')
                }
            })
        }
    }
    successBuy() {
        const fragment = document.createElement('template')
        const message = document.createElement('p')
        message.classList.add('mt-[50px]', 'mb-[50px]', 'text-[32px]')
        message.textContent = 'Order completed successfully'
        fragment.content.append(message)
        const block = document.querySelector('.modalGrid')
        if (block) {
            block.innerHTML = ''
            block.append(fragment.content)
            block.classList.add('flex')
            localStorage.setItem('cartArticles', '[]')
            localStorage.setItem('sumOfCart', '0')
            const timer = setTimeout(() => {
                const logo = document.querySelector('.header__top-logo') as HTMLElement
                const headerCount = document.querySelector('.cartIconCount')
                const headerSum = document.querySelector('.sumOfItems')
                if (headerCount && headerSum) {
                    headerCount.textContent = String(0)
                    headerSum.textContent = String(0)
                }
                logo.click()
            }, 5000)
        }
    }

    emit(event: CartViewEventsName, data?: string, itemData?: ItemData) {
        return super.emit(event, data)
    }

    on(event: CartViewEventsName, callback: (data: string, itemData: ItemData) => void) {
        return super.on(event, callback)
    }
}
