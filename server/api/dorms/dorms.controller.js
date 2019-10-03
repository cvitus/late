const logger = require('../../modules/logger')

const Dorm = require('./dorms.model')

function deleteDorm (ctx) {

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
