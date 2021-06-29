import mongoose from 'mongoose';

const parkSchema = mongoose.Schema({
  key: String,
  name: String,
  alias: String,
  city: String,
  state: String,
  country: String
})

export default mongoose.model('parks', parkSchema);