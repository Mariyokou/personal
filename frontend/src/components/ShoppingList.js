import { useState } from 'react'
import SortableList, { SortableItem } from 'react-easy-sort'
import arrayMove from 'array-move'
import classNames from 'classnames'
// import { GrDrag, GrEdit, GrTrash } from 'react-icons/gr'


function generateId() {
	return `${new Date().getTime()}-${Math.ceil(Math.random(1,100)*100)}`
}

const initialList = [
	{
		id: generateId(),
		text: 'bread',
		isComplete: false,
	},
	{
		id: generateId(),
		text: 'meat',
		isComplete: true,
	},
	{
		id: generateId(),
		text: 'coffee',
		isComplete: false,
	},
	{
		id: generateId(),
		text: 'cheese',
		isComplete: false,
	}
]


export function ShoppingList() {
	const [list, setList] = useState(initialList)
	const [newItem, setNewItem] = useState('')
	const [insertPosition, setInsertPosition] = useState('last')
	const [editElement, setEditElement] = useState(null)
	const [error, setError] = useState('')

	function addItem(event) {
		event.preventDefault()
		setError('')

		if (!newItem) {
			setError('Please enter a value')
			return
		}

		setList(x => insertPosition === 'first'
			? [
				{
					id: generateId(),
					text: newItem,
					isComplete: false,
				},
				...x,
			]
			: [
				...x,
				{
					id: generateId(),
					text: newItem,
					isComplete: false,
				},
			],
		)
		setNewItem('')
	}

	function sortList(oldIndex, newIndex) {
		setList((array) => arrayMove(array, oldIndex, newIndex))
	}

	function editItem(event) {
		event.preventDefault()
		setList(l => {
			return l.map((item) => {
				return item.id === editElement.id
					? {
						...item,
						text: editElement.text,
					}
					: item
			})
		})
		setEditElement(null)
	}

	return (
		<div>
			<SortableList onSortEnd={sortList} className="flex flex-col items-center gap-10" draggedItemClassName="dragged">
				{list.map(x =>
					<SortableItem key={x.id}>
						<div className="item">
							<form onSubmit={(e) => editItem(e)} className="list-item">
								<span classNames="cursor-pointer">Drag</span>
								{ editElement?.id === x.id &&
									<input type="text" value={editElement.text} onChange={(e) =>
										setEditElement(el => ({ ...el, text: e.target.value }))
									} />
								}
								{ editElement?.id !== x.id &&
									<label >
										<input
											type="checkbox" checked={x.isComplete} onChange={() => setList(l => {
												return l.map((item) => {
													return item.id === x.id
														? {
															...item,
															isComplete: !item.isComplete,
														}
														: item
												})
											})}
										/>
										<span className={classNames(x.isComplete && 'line-through')}>{x.text}</span>
									</label>
								}
								{ editElement?.id !== x.id &&
									<button onClick={() => setEditElement(x)}>Edit</button>
								}
								{ editElement?.id === x.id &&
									<div className="flex gap-10">
										<button type="button" onClick={() => setEditElement(null)}>Cancel</button>
										<button type="submit" disabled={!editElement.text?.trim()}>Save</button>
									</div>
								}
								<button type="button" onClick={() => setList(l => l.filter((item) => item.id !== x.id))}>
									<span>Delete</span>
								</button>
							</form>
						</div>
					</SortableItem>
				)}
			</SortableList>
			<form onSubmit={addItem}>
				<div className="flex justify-center items-center mt-40 gap-20">
					<input
						type="text"
						value={newItem}
						onChange={(e) => { setNewItem(e.target.value); setError('') }}
					/>
					<label >
						<input type="radio" name="insertPosition" value="first" checked={insertPosition==='first'}
							onChange={() => setInsertPosition('first')}
						/>
						Insert at the beginning
					</label>
					<label >
						<input type="radio" name="insertPosition" value="last" checked={insertPosition==='last'}
							onChange={() => setInsertPosition('last')}
						/>
							Insert at the end
					</label>
					<button type="submit" >Submit </button>
				</div>
				{error && <p className="error text-center">{error}</p>}
			</form>
		</div>
	)
}
