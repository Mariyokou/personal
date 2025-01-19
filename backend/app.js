const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(bodyParser.json())

const tasksRoute = require('./routes/tasks')
const tasksWithSQLiteRoute = require('./routes/tasksWithSQLite')

app.use('/tasks', tasksRoute)
app.use('/sqliteTasks', tasksWithSQLiteRoute)

const PORT = 5000
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})