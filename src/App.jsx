import { useState, useMemo, useRef, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss'
import LoginPage from './components/LoginPage/LoginPage'
import ErrorPage from './components/ErrorPage/ErrorPage'
import MainPage from './components/MainPage/MainPage'
import UsersPage from './components/UsersPage/UsersPage'

function App() {

	const [sessionIsActive, setSessionIsActive] = useState(false)

	function onSessionExpired() {
		localStorage.removeItem('session')
		localStorage.removeItem('user-info')
		if (location.pathname !== '/') {
			location.pathname = '/'
		}
	}

	useMemo(() => {
		const session = localStorage.getItem('session')
		if (session === null) return

		fetch(`${localStorage.getItem('origin')}/login`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': session
			},
			body: JSON.stringify({})
		})
			.then(res => res.json())
			.then(json => {
				if (json.error !== null) {
					onSessionExpired()
					return
				}
				localStorage.setItem('user-info', json.data.Username)
				setSessionIsActive(true)
			})
	}, [sessionIsActive])

	useEffect(() => {
		document.addEventListener('click', (evt) => {
			const target = evt.target

			if (!target.closest('.profile') && document.querySelector('.profile')) {
				document.querySelector('.profile').classList.remove('active')
			}
		})
	}, [])

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={sessionIsActive ? <MainPage /> : <LoginPage setSessionIsActive={setSessionIsActive} />} />
				<Route path='/users' element={<UsersPage onSessionExpired={onSessionExpired} />} />
				<Route path='*' element={<ErrorPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
