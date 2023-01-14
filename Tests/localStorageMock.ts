export class LocalStorageMock {
  private cartArticles: string;
  length: number;
  constructor() {
    this.cartArticles = '[{"article":1295042,"count":1},{"article":1294716,"count":1},{"article":1297914,"count":1},{"article":1295039,"count":1}]'
    this.length = 0
  }

  getItem(value: string) {
    switch (value) {
      case 'cartArticles':
        return this.cartArticles
      case 'sumOfCart':
        return '123'
    }
    return null
  }

  setItem(value: string) {
    this.cartArticles = value
  }

  clear() {

    this.cartArticles = '[]'
  }

  key() {
    return '1' || null
  }

  removeItem() {
    return
  }
}
