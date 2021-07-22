import mongoose from 'mongoose';

const teamsFranchisesSchema = mongoose.Schema({
  franchID: String,
  franchName: String,
  active: String,
  NAassoc: String,
  logo: String
})

export default mongoose.model('teamsFranchises', teamsFranchisesSchema)