const logger = require('../../modules/logger')

const Dorm = require('./dorms.model')

async function deleteDorm (ctx) {
  if (!ctx.params || !ctx.params.id) {
    return ctx.badRequest('You must provide a dorm ID to delete.')
  }

  const d = await Dorm.findOne({ _id: ctx.params.id })
  if (!d) {
    return ctx.notFound('Dorm does not exist')
  }

  d.remove()
  logger.info('Deleted dorm ID ' + d._id + ' as requested by user ' + ctx.state.user.rcs_id)
  ctx.noContent()
}

function createDorm (ctx) {

}

function updateDorm (ctx) {

}

function refreshDormData (ctx) {

}

async function getDorms (ctx) {
  const dorms = await Dorm.find({ name: ctx.query.search || undefined })
  ctx.ok({ dorms })
}

module.exports = {
  getDorms,
  refreshDormData,
  updateDorm,
  deleteDorm,
  createDorm
}
