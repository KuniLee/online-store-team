import queryString from 'query-string'

document.querySelector('#app')!.innerHTML = `
  <header class="p-4 mb-3 bg-cyan-200 border-b-2 border-emerald-800">
    <nav class="container mx-auto">
      <a href="/" class="bg-blue-700 mx-1 rounded-xl p-1 px-2 text-red-100 hover:bg-amber-300">Главная</a>
      <a href="/catalog" class="bg-blue-700 mx-1 rounded-xl p-1 px-2 text-red-100 hover:bg-amber-300">Каталог</a>
      <a href="/cart" class="bg-blue-700 mx-1 rounded-xl p-1 px-2 text-red-100 hover:bg-amber-300">Корзина</a>
    </nav>
  </header>
  <main id="main"></main>`

document.querySelectorAll('nav a').forEach((btn) => {
    btn.addEventListener('click', (ev) => {
        ev.preventDefault()
        urlRoute(ev)
    })
})

const urlRoute = (event: Event) => {
    event = event || window.event // get window.event if event argument not provided
    event.preventDefault()
    window.history.pushState({}, '', (event.target as HTMLAnchorElement).href)
    urlLocationHandler()
}

const main = document.querySelector('main')

const urlLocationHandler = async () => {
    let location = window.location.pathname
    console.log(location)
    const parsed = queryString.parse(window.location.search)
    console.log(parsed)
    if (location.length == 0) {
        location = '/'
    }
    if (main)
        switch (location) {
            case '/':
                main.innerHTML = '<h1 class="text-blue-800">Это главная</h1>'
                break
            case '/catalog':
                main.innerHTML = '<h1 class="text-blue-800">Это каталог</h1>'
                break
            case '/cart':
                main.innerHTML = '<h1 class="text-blue-800">Это корзина</h1>'
                break
            default:
                main.innerHTML = '<h1 class="text-blue-800">Это 404</h1>'
        }
}

// add an event listener to the window that watches for url changes
window.onpopstate = urlLocationHandler

// call the urlLocationHandler function to handle the initial url
urlLocationHandler()
