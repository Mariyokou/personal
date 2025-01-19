const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3')


const db = new sqlite3.Database('./tasks.db', (err) => {
	if (err) {
		console.error('Error connecting to SQLite:', err)
	} else {
		console.log('Connected to SQLite database.')
	}
})

db.run(`
	CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		isComplete BOOLEAN DEFAULT 0,
		isUrgent BOOLEAN,
 		createdAt DATE DEFAULT (CURRENT_DATE),
 		notes TEXT
	)
`)

router.get('/', (req, res) => {
	db.all('SELECT * FROM tasks', (err, rows) => {
		if (err) { return res.status(500).send(err) }

		const taskDtos = rows.map(t => ({
			id: t.id,
			title: t.title,
			isComplete: !!t.isComplete,
			isUrgent: !!t.isUrgent,
			hasNotes: !!t.notes,
		}))

		res.json(taskDtos)
	})
})

router.get('/:id', (req, res) => {
	const { id } = req.params

	const query = 'SELECT * FROM tasks WHERE id = ? LIMIT 1'
	const params = [id]

	db.get(query, params, (err, result) => {
		if (err) { return res.status(500).send(err) }
		if (!result) { return res.status(404).json({ error: 'Task not found' }) }

		res.json({ ...result, isComplete: !!result.isComplete, isUrgent: !!result.isUrgent })
	})
})

router.post('/', (req, res) => {
	const { title, isComplete = false, notes } = req.body
	let { isUrgent } = req.body

	if (!title) {
		return res.status(400).json({ error: 'Title is required' })
	}

	if (isComplete === true) {
		isUrgent = false
	}

	const query = 'INSERT INTO tasks (title, isComplete, isUrgent, notes) VALUES (?, ?, ? , ?)'
	const params = [title, isComplete, isUrgent, notes]

	db.all(query, params, (err, result) => {
		if (err) { return res.status(500).send(err) }
		res.sendStatus(201)
	})
})

router.put('/:id', (req, res) => {
	const { id } = req.params
	const { title, isComplete = false, notes } = req.body
	let { isUrgent } = req.body

	if (isComplete === true) {
		isUrgent = false
	}

	const query = `
		UPDATE tasks
		SET title = ?, isComplete = ?, isUrgent = ?, notes = ?
		WHERE id = ?
  	`
	const params = [title, isComplete, isUrgent, notes, id]

	db.run(query, params, function (err) {
		if (err) { return res.status(500).send(err) }
		if (this.changes === 0) { return res.status(404).json({ error: 'Task not found' }) }

		res.sendStatus(204)
	})
})

router.delete('/:id', (req, res) => {
	const { id } = req.params
	const query = 'DELETE FROM tasks WHERE id = ?'
	const params = [id]

	db.run(query, params, function (err) {
		if (err) { return res.status(500).send(err) }
		if (this.changes === 0) { return res.status(404).json({ error: 'Task not found' }) }

		res.sendStatus(204)
	})
})

module.exports = router
