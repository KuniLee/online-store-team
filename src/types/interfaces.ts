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
    updatedAt: Date
}

export type Filter = {
    [index: string]: {
        check: boolean
        total: number
        count: number
    }
}
export type DualSlider = {
    min: number
    max: number
}

export interface FiltersSetting {
    category: Filter
    brand: Filter
    price: Partial<DualSlider>
    stock: Partial<DualSlider>
    total: number
}
