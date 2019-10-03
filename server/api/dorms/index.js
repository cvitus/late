const Router = require('koa-router')
const router = new Router()

const Ctrl = require('./dorms.controller')

const requireAdmin = function (ctx, next) {
  if (!ctx.state.user || !ctx.state.user.admin) return ctx.unauthorized('Must be logged in as an admin!')
  return next()
}

router.get('/:id', Ctrl.getDorms)
router.get('/:id/refresh', requireAdmin, Ctrl.refreshDormData)
router.post('/', requireAdmin, Ctrl.createDorm)
router.put('/:id', requireAdmin, Ctrl.updateDorm)
router.delete('/:id', requireAdmin, Ctrl.deleteDorm)

module.exports = router.routes()
