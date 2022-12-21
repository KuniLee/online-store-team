import footer from '@/templates/footer.html'
import header from '@/templates/header.html'

export function NotFound() {
    const fragment = document.createElement('template')
    const fragmentFooter = document.createElement('template')
    const fragmentHeader = document.createElement('template')

    // const Model = new ItemsModel()
    // const View = new ItemsView(Model, container)
    // const Controller = new ItemsController(Model, View)

    fragment.innerHTML = ` <main class="flex-auto flex-shrink-0">
    <div class="max-w-[1200px] mx-auto flex justify-center items-center">
      <p class="text-[120px]">404</p>
    </div>
  </main>`
    fragmentFooter.innerHTML = footer
    fragmentHeader.innerHTML = header
    fragment.content.append(fragmentFooter.content)
    fragment.content.prepend(fragmentHeader.content)

    return fragment.content
}
