import express from 'express'
import cors from 'cors'
import Hello from './Hello.js'
import Lab5 from './Lab5.js'

const PORT = 4000;

const app = express()

app.use(cors())
app.use(express.json())

Lab5(app);
Hello(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
