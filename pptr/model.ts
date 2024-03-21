import mongoose from 'mongoose'
const { Schema, model } = mongoose

const filmSchema = new Schema({
  _id         : String,
  duration    : Number,
  locale      : String,
  origin      : String,
  type        : String,
  episodes    : Number,
  saisons     : Number,
  title       : String,
  orginalTitle: String,
  public      : String,
  rating      : {},
  publish     : Date,
  description : String,
  actor       : [String],
  genre       : [String],
  keywords    : [String],
})

export const filmModel = model('films', filmSchema)