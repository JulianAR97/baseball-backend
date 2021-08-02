import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import apiRouter from './lib/routes/API/api.js'

// Get environment variables for developing locally
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
app.use(express.json())
app.use(cors())

// Connect to Database
const connection_url = process.env.CONNECTION_URL
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

app.get('/', (req, res) => {
  res.status(200).json([])
})

// All routes for API
app.use('/api', apiRouter)


// Listen
const port = process.env.PORT || 8001
app.listen(port, () => console.log(`Listening on port ${port}`));


