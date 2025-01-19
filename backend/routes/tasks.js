const express = require('express')
const router = express.Router()

let tasks = [
	{ id: 1, title: 'Wash the dishes', isComplete: false, },
	{ id: 2, title: 'Take out trash', isComplete: true },
	{ id: 3, title: 'Call John', isComplete: false, isUrgent: true, notes: "Discuss the new project details" },
	{ id: 4, title: 'Water the plants', isComplete: true, isUrgent: false },
]

router.get('/', (req, res) => {
	const taskDtos = tasks.map(t => ({
		id: t.id,
		title: t.title,
		isComplete: t.isComplete,
		isUrgent: t.isUrgent,
		hasNotes: !!t.notes,
	}))

	res.json(taskDtos)
})

router.get('/:id', (req, res) => {
	const { id } = req.params
	const task = tasks.find(t => t.id === parseInt(id))

	if (!task) {
		return res.status(404).json({ error: 'Task not found' })
	}

	res.json(task)
})

function setFields(task, body) {
	const { title, isComplete, isUrgent, notes } = body

	if (title) {
		task.title = title
	}
	if (isComplete !== undefined) {
		task.isComplete = isComplete
	}
	if (isUrgent !== undefined) {
		task.isUrgent = isUrgent
	}
	if (isComplete === true) {
		task.isUrgent = false
	}
	if (notes !== undefined) {
		task.notes = notes
	}
}

router.post('/', (req, res) => {
	if (!req.body.title) {
		return res.status(400).json({ error: 'Title is required' })
	}

	const newTask = {
		id: tasks.length + 1,
		createdAt: new Date,
	}

	setFields(newTask, req.body)

	tasks.push(newTask)

	res.sendStatus(201)
})

router.put('/:id', (req, res) => {
	const { id } = req.params
	const task = tasks.find(t => t.id === parseInt(id))

	if (!task) {
		return res.status(404).json({ error: 'Task not found' })
	}

	setFields(task, req.body)

	res.sendStatus(204)
})

router.delete('/:id', (req, res) => {
	const { id } = req.params

	tasks = tasks.filter((task) => task.id !== parseInt(id))
	res.sendStatus(204)
})

module.exports = router