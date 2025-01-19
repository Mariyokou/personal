import './App.css'
import React from 'react'
import { ShoppingList } from './components/ShoppingList'
import { TaskList } from './components/TaskList'
import classNames from 'classnames'

function App() {
	const [activePage, setActivePage] = React.useState('taskList')

	return (
		<div>
			<h1 className="text-center">Marijos</h1>
			<div className="flex flex-col justify-center gap-x-5 mb-40 pl-10">
				<p className={classNames('page-select', activePage === 'shoppingList' && 'active')}
					onClick={() => setActivePage('shoppingList')}
				>
					Shopping list (only React)
				</p>
				<p className={classNames('page-select', activePage === 'taskList' && 'active')}
					onClick={() => setActivePage('taskList')}
				>
					Task list (React + Node)
				</p>
			</div>
			{ activePage === 'shoppingList' && <ShoppingList/> }
			{ activePage === 'taskList' && <TaskList/> }
		</div>
	)
}

export default App
