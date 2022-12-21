import type { Location } from 'history'
// import { ItemsModel } from '@/components/models/model'
// import { ItemsView } from '@/components/views/view'
// import { ItemsController } from '@/components/controllers/controller'
import footer from '@/templates/footer.hbs'
import mainTemplate from '@/templates/mainpage.html'
import header from '@/templates/header.html'

export function Main(location: Location) {
    const fragment = document.createElement('template')
    const fragmentFooter = document.createElement('template')
    const fragmentHeader = document.createElement('template')

    // const Model = new ItemsModel()
    // const View = new ItemsView(Model, container)
    // const Controller = new ItemsController(Model, View)

    fragment.innerHTML = mainTemplate
    fragmentFooter.innerHTML = footer({
        year: new Date().getFullYear(),
        img: require('@/assets/images/rs_school_js.svg'),
    })
    fragmentHeader.innerHTML = header
    fragment.content.append(fragmentFooter.content)
    fragment.content.prepend(fragmentHeader.content)

    return fragment.content
}
