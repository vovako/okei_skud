import { useState, useMemo, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss'
import LoginPage from './components/LoginPage/LoginPage'
import ErrorPage from './components/ErrorPage/ErrorPage'
import MainPage from './components/MainPage/MainPage'
import UsersPage from './components/UsersPage/UsersPage'

function App() {

	const [sessionIsActive, setSessionIsActive] = useState(false)


	useEffect(() => {
		const session = localStorage.getItem('session')
		if (session !== null) {
			setSessionIsActive(true)
			return
		}
	}, [sessionIsActive])
	// useMemo(() => {


	// fetch(`${localStorage.getItem('origin')}/login`, {
	// 	method: 'post',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'Authorization': session
	// 	},
	// 	body: JSON.stringify({})
	// })
	// 	.then(res => res.json())
	// 	.then(json => {
	// 		if (json.error === null) {
	// 			localStorage.setItem('user-info', json.data.Username)
	// 			setSessionIsActive(true)
	// 		}
	// 	})
	// }, [])

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={sessionIsActive ? <MainPage /> : <LoginPage setSessionIsActive={setSessionIsActive} />} />
				<Route path='*' element={<ErrorPage />} />
				<Route path='/users' element={<UsersPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
