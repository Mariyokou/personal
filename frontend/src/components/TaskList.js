import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { RadioButtonGroup } from './RadioButtonGroup'
import { Modal } from './Modal'
import classNames from 'classnames'
import { format } from 'date-fns'


export function TaskList() {
	const [selectedDatabase, setSelectedDatabase] = useState('local')
	const [addError, setAddError] = useState('')
	const [actionsError, setActionsError] = useState({})
	const [tasks, setTasks] = useState([])
	const [editTask, setEditTask] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const databaseOptions = [
		{ value: 'local', label: 'Local' },
		{ value: 'sqlite', label: 'Sqlite' },
	]
	const yesNoOptions = [
		{ value: true, label: 'Yes' },
		{ value: false, label: 'No' },
	]

	const BASE_URL = 'http://localhost:5000'
	const API_URL = useMemo(() =>
		selectedDatabase === 'local' ? `${BASE_URL}/tasks` : `${BASE_URL}/sqliteTasks`
	, [selectedDatabase])

	function load() {
		axios.get(API_URL).then(res => setTasks(res.data)).catch((e) => console.error(e.message))
	}

	useEffect(load, [API_URL])

	function addTask() {
		axios.post(API_URL, editTask)
			.then(() => {
				load()
			}).catch((e) => {
				if (e.response) {
					console.error(e.response.data)
					setAddError(`Error while adding task: ${e.response.data.error ?? e.response.statusText}`)
				} else {
					console.error(e.message)
					setAddError(`Error while adding task: ${e.message}`)
				}
			})
	}

	function updateTask(_editTask) {
		if (!_editTask || !_editTask.id) {
			return
		}

		setActionsError(ae => ({
			...ae,
			[id]: '',
		}))

		const id = _editTask.id

		if (!_editTask.title.trim()) {
			setActionsError(ae => ({
				...ae,
				[_editTask.id]: 'Error while editing task: Title is required',
			}))
			return
		}

		axios.put(`${API_URL}/${id}`, _editTask)
			.then(() => {
				load()
				setEditTask(null)
			}).catch((e) => {
				if (e.response) {
					console.error(e.response.data)
					setActionsError(ae => ({
						...ae,
						[id]:  `Error while editing task: ${e.response.data.error ?? e.response.statusText}`,
					}))
				} else {
					console.error(e.message)
					setActionsError(ae => ({
						...ae,
						[id]:  `Error while editing task: ${e.message}`,
					}))
				}
			})
	}

	function deleteTask(id) {
		if (!id) { return }

		setActionsError(ae => ({
			...ae,
			[id]: '',
		}))

		axios.delete(`${API_URL}/${id}`).then(() => {
			load()
		}).catch((e) => {
			if (e.response) {
				console.error(e.response.data)
				setActionsError(ae => ({
					...ae,
					[id]:  `Error while deleting task: ${e.response.data.error ?? e.response.statusText}`,
				}))
			} else {
				console.error(e.message)
				setActionsError(ae => ({
					...ae,
					[id]:  `Error while deleting task: ${e.message}`,
				}))
			}
		})
	}

	function showTaskDetails(id) {
		if (id) {
			axios.get(`${API_URL}/${id}`).then(res => {
				setEditTask(res.data)
				setIsModalOpen(true)
			}).catch((e) => {
				if (e.response) {
					console.error(e.response.data)
					setActionsError(ae => ({
						...ae,
						[id]:  `Error while getting task: ${e.response.data.error ?? e.response.statusText}`,
					}))
				} else {
					console.error(e.message)
					setActionsError(ae => ({
						...ae,
						[id]:  `Error while getting task: ${e.message}`,
					}))
				}
			})
		} else {
			setEditTask({ title: '', notes: '' })
			setIsModalOpen(true)
		}
	}

	async function saveTask() {
		if (editTask?.id) {
			updateTask(editTask)
			setIsModalOpen(false)
		}
		else {
			addTask()
			setIsModalOpen(false)
		}
	}

	return (
		<div className="flex flex-col items-center gap-10 gap-y-10">
			<div className="text-center w-9/12">
				<RadioButtonGroup label="Select database:" options={databaseOptions} name="database"
					onChange={(event) => setSelectedDatabase(event.target.value)} selectedValue={selectedDatabase}
				/>
			</div>

			<button onClick={() => showTaskDetails()}>Add Task</button>
			{addError && <p className="error text-center">{addError}</p>}

			<div className="flex flex-col items-center w-9/12">
				<h3 className="text-center">Todo list:</h3>
				<table>
					<tbody>
						{tasks.map(task => (
							<tr key={task.id}>
								<td className="px-2 whitespace-nowrap">
									<label className="flex gap-x-1">
										<input
											type="checkbox" checked={task.isComplete} onChange={() =>
												updateTask({ ...task, isComplete: !task.isComplete })
											}
										/>
										<div className="flex items-center gap-x-1">
											{ task.isUrgent &&
												<span className="urgent-icon">!</span>
											}
											<span className={classNames(task.isComplete && 'line-through')}>
												{task.title}
											</span>
											{ task.hasNotes &&
												<span>*</span>
											}
										</div>
									</label>
								</td>
								<td className="px-2">
									<button onClick={() => showTaskDetails(task.id)}>Edit</button>
								</td>
								<td className="px-2">
									<button onClick={() => deleteTask(task.id)}>
										Delete
									</button>
								</td>
								<td>
									{actionsError[task.id] && (
										<span className="error">{actionsError[task.id]}</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
					title={editTask?.id ? 'Edit task' : 'Add new task'}
				>
					<div className="flex gap-10">
						<span className="font-bold">Task:</span>
						<input type="text" value={editTask?.title}
							onChange={e => setEditTask(el => ({ ...el, title: e.target.value }))}
						/>
					</div>
					<RadioButtonGroup
						label="Task is urgent:"
						options={yesNoOptions}
						name="isUrgent"
						onChange={e => setEditTask(el => ({ ...el, isUrgent: e.target.value === 'true' }))}
						selectedValue={editTask?.isUrgent}
					/>
					<RadioButtonGroup
						label="Task is complete:"
						options={yesNoOptions}
						name="isComplete"
						onChange={e => setEditTask(el => ({ ...el, isComplete: e.target.value === 'true' }))}
						selectedValue={editTask?.isComplete}
					/>
					<div className="flex gap-10">
						<span className="font-bold">Notes:</span>
						<textarea type="text" value={editTask?.notes}
							onChange={e => setEditTask(el => ({ ...el, notes: e.target.value }))}
						/>
					</div>
					{editTask?.id &&
						<div className="flex gap-10">
							<span className="font-bold">Created at:</span>
							<span>
								{editTask?.createdAt
									? format(new Date(editTask?.createdAt), 'yyyy.MM.dd')
									: '-'
								}
							</span>
						</div>
					}
					<div className="flex gap-10">
						<button onClick={saveTask}>Save</button>
						<button onClick={() => { deleteTask(editTask?.id); setIsModalOpen(false) }}>Delete</button>
						<button onClick={() => setIsModalOpen(false)}>Close</button>
					</div>
				</Modal>
			</div>
		</div>
	)
}
