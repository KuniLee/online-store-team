export interface Test {
    test: string
}

export interface Item {
    price: number
    images: Array<URL>
    title: string
    category: string
    brand: string
    article: number
    description: string
    stock: number
    id: string
}

type Filter = {
    [index: string]: {
        total: number
        count: number
    }
}
type DualSlider = {
    min: number
    max: number
}

export interface Filters {
    category: Filter
    brand: Filter
    price: Partial<DualSlider>
    stock: Partial<DualSlider>
}
