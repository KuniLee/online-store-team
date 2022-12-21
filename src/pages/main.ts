import type { Location } from 'history'
// import { ItemsModel } from '@/components/models/model'
// import { ItemsView } from '@/components/views/view'
// import { ItemsController } from '@/components/controllers/controller'
import mainTemplate from '@/templates/mainpage.html'
import footer from '@/templates/footer.html'
import header from '@/templates/header.html'

export function Main(location: Location) {
    const fragment = document.createElement('template')
    const fragmentFooter = document.createElement('template')
    const fragmentHeader = document.createElement('template')

    // const Model = new ItemsModel()
    // const View = new ItemsView(Model, container)
    // const Controller = new ItemsController(Model, View)

    fragment.innerHTML = mainTemplate
    fragmentFooter.innerHTML = footer
    fragmentHeader.innerHTML = header
    fragment.content.append(fragmentFooter.content)
    fragment.content.prepend(fragmentHeader.content)

    return fragment.content
}
