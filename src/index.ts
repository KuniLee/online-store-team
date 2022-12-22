import '@/styles/style.css'
import { AppModel } from '@/components/models/model'
import { AppView } from '@/components/views/view'
import { AppController } from '@/components/controllers/controller'
//import '@/utils/routing'

const model = new AppModel()
const view = new AppView(model, document.body)
const controller = new AppController(model, view)
