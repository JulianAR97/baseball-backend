import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 8001
const connection_url = 'mongodb+srv://admin:xZY7dcuBDsTb5VJ5@test.kqpeh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'



app.get('/api')

app.listen(port, () => console.log(`Listening on port ${port}`));


