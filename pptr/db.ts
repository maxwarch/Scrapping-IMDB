import path from 'path'

import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: path.resolve('../.env') })

export function connectDb() {
  mongoose.connect(`mongodb://${process.env.FILM_USER}:${process.env.FILM_PWD}@localhost:${process.env.DB_PORT}/${process.env.FILM_DB}`)
}