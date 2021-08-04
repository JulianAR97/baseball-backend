import mongoose from 'mongoose';

const standingSchema = mongoose.Schema({
  'NL': {type: Object},
  'AL': {type: Object}
})

export default mongoose.model('standings', standingSchema)