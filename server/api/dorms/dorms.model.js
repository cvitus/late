const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    _thumbnail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DormPhoto'
    },
    dormKey: { type: String, minlength: 3, maxlength: 100, required: true }, // RPI SLL website key
    styles: [{ type: String, enum: ['Suite', 'Traditional'] }],
    roomTypes: [{
      name: { type: String, required: true, maxlength: 35 },
      area: { type: Number }, // Area of the room in sqft
      price: { type: Number } // dollars per year
    }],
    perSuite: { type: Number },
    floorCount: { type: Number },
    occupancy: { type: Number },
    staffOccupancy: { type: Number },
    hasThemeCommunity: { type: Boolean },
    isCoEd: { type: Boolean },
    hasGenderInclusive: { type: Boolean },
    genderBreakdown: { type: String, maxlength: 35 },

    hasFloorRestrooms: { type: Boolean },
    hasRoomRestrooms: { type: Boolean },
    hasCleaning: { type: Boolean },
    cleaningFrequency: { type: String, maxlength: 35 },
    hasGenderNeutralRestroom: { type: Boolean },

    furniture: [{ // e.g. wardrobe, loftable bed, closet, etc.
      name: { type: String, maxlength: 100 },
      exists: { type: Boolean },
      description: { type: String, maxlength: 100 }
    }],

    amenities: [{ // e.g. AC, blinds, cable, etc.
      name: { type: String, maxlength: 100 },
      exists: { type: Boolean }
    }],

    closestDiningHall: { type: String,
      enum: ['Commons Dining Hall', 'Russell Sage Dining Hall',
        'BARH Dining Hall', 'Blitman Dining Hall'] }
  },
  { timestamps: true }
)

schema.set('toObject', { getters: true, virtuals: true })
schema.set('toJSON', { getters: true, virtuals: true })

module.exports = mongoose.model('Dorm', schema)
