import { useState, useMemo, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss'
import LoginPage from './components/LoginPage/LoginPage'
import ErrorPage from './components/ErrorPage/ErrorPage'
import MainPage from './components/MainPage/MainPage'
import UsersPage from './components/UsersPage/UsersPage'
import KeysPage from './components/KeysPage/KeysPage'

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
			if (!target.closest('.popup') && document.querySelector('.popup.active')) {
				if (!target.closest('#add-user-popup') && !target.classList.contains('users-list__add-btn')) {
					document.querySelector('#add-user-popup').classList.remove('active')
				}
				if (!target.closest('#filter-popup') && !target.classList.contains('users-filter__btn')) {
					document.querySelector('#filter-popup').classList.remove('active')
				}
			}
		})
	}, [])

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={sessionIsActive ? <MainPage /> : <LoginPage setSessionIsActive={setSessionIsActive} />} />
				<Route path='/users' element={<UsersPage onSessionExpired={onSessionExpired} />} />
				<Route path='/keys' element={<KeysPage onSessionExpired={onSessionExpired} />} />
				<Route path='*' element={<ErrorPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
