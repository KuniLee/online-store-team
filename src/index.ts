import '@/styles/style.css'

import { AppModel } from '@/components/models/model'
import { AppView } from '@/components/views/AppView'
import { AppController } from '@/components/controllers/AppController'
import { Router } from '@/utils/Rooter'
import { CatalogController } from '@/components/controllers/CatalogController'
import { CatalogView } from '@/components/views/CatalogView'
import { CartView } from '@/components/views/CartView'
import { CartController } from '@/components/controllers/CartController'
import { ItemController } from '@/components/controllers/ItemController'
import { ItemView } from '@/components/views/ItemView'

const router = new Router()
const model = new AppModel()

const appView = new AppView(model, document.body)
const mainContainer = appView.buildApp()
const catalogView = new CatalogView(model, mainContainer)
const cartView = new CartView(model, mainContainer)
const itemView = new ItemView(model, mainContainer)

const catalogController = new CatalogController(model, catalogView)
const itemController = new ItemController(model, itemView)
const cartController = new CartController(model, cartView)
const controller = new AppController(model, appView, router)
