export function NotFound() {
    const div = document.createElement('template')
    const h1 = document.createElement('h1')
    h1.innerText = 'Not found'
    div.append(h1)
    return div.content
}
