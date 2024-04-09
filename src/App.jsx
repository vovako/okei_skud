import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss'
import LoginPage from './components/LoginPage/LoginPage'
import ErrorPage from './components/ErrorPage/ErrorPage'
import MainPage from './components/MainPage/MainPage'
import UsersPage from './components/UsersPage/UsersPage'
import KeysPage from './components/KeysPage/KeysPage'
import { ErrorModal } from './components/ModalDialog/ModalDialog'

export default function App() {

	const [sessionIsActive, setSessionIsActive] = useState(false)

	function onSessionExpired() {
		// localStorage.removeItem('session')
		// localStorage.removeItem('user-info')
		// if (location.pathname !== '/') {
		// 	location.pathname = '/'
		// }
	}

	function onFetchError(msg) {
		const errorModal = document.body.querySelector('#error-modal')
		errorModal.querySelector('.modal-dialog__text').textContent = msg
		errorModal.showModal()
	}

	// useMemo(() => {
	// 	fetch(`${localStorage.getItem('origin')}/login`, {
	// 		method: 'post',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({})
	// 	})
	// 		.then(res => res.json())
	// 		.then(json => {
	// 			if (json.error !== null) {
	// 				onFetchError(json.error)
	// 				return
	// 			}
	// 			localStorage.setItem('user-info', json.data.Username)
	// 			setSessionIsActive(true)
	// 		})
	// }, [sessionIsActive])

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

	function loadGroup() {
		return new Promise((resolve, reject) => {
			fetch(`${localStorage.getItem('origin')}/api/persons/departments`, {
				credentials: 'include'
			})
				.then(res => res.json())
				.then(json => {
					if (json.error) {
						onFetchError(json.error)
						reject()
					}
					resolve(json.data)
				})
		})
	}

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={sessionIsActive ? <MainPage onFetchError={onFetchError} /> : <LoginPage setSessionIsActive={setSessionIsActive} />} />
					<Route path='/users' element={<UsersPage onFetchError={onFetchError} loadGroup={loadGroup} />} />
					<Route path='/keys' element={<KeysPage onFetchError={onFetchError} />} />
					<Route path='*' element={<ErrorPage />} />
				</Routes>
			</BrowserRouter>
			{createPortal(
				<ErrorModal />,
				document.body
			)}
		</>
	)
}



