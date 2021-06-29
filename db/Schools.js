import mongoose from 'mongoose';

const schoolsSchema = mongoose.Schema({
  schoolID: String,
  name_full: String,
  city: String,
  state: String,
  country: String
})

export default mongoose.model('schools', schoolsSchema)