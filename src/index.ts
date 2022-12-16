import '@/styles/style.css'
//
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
