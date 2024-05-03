import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Routes, Route, HashRouter } from 'react-router-dom'
import './App.scss'
import LoginPage from './components/LoginPage/LoginPage'
import ErrorPage from './components/ErrorPage/ErrorPage'
import MainPage from './components/MainPage/MainPage'
import UsersPage from './components/UsersPage/UsersPage'
import KeysPage from './components/KeysPage/KeysPage'
import { ErrorModal } from './components/ModalDialog/ModalDialog'
import { onFetchError } from '/src/components/func/fetch';
import { AuthContext } from './context'

export default function App() {

	const [eventsList, setEventsList] = useState([])
	const [enterCount, setEnterCount] = useState(0)
	const [exitCount, setExitCount] = useState(0)
	const [anomaliesIn, setAnomaliesIn] = useState(1)
	const [anomaliesOut, setAnomaliesOut] = useState(1)
	const [isAuth, setIsAuth] = useState(false)

	

	function updateEventsList(newData) {
		setEventsList(prev => {
			const temp = [...prev]
			temp.push(...newData)
			if (temp.length - 100 > 0) {
				temp.splice(0, temp.length - 100)
			}
			return temp
		})
	}

	useMemo(() => {
		const link = localStorage.getItem('origin').replace('http', 'ws')
		const ws = new WebSocket(`${link}/api/ws/monitor`)

		ws.onmessage = (evt) => {
			const json = JSON.parse(evt.data)
			if (json.error !== null) {
				onFetchError(json.error)
				return
			}
			const data = json.data
			updateEventsList(data.Events)
			setEnterCount(data.CountInside)
			setExitCount(data.CountOutside)
			setAnomaliesIn(data.AnomalyIn)
			setAnomaliesOut(data.AnomalyOut)
		}
	}, [])

	useEffect(() => {
		if (localStorage.getItem('user-info') !== null) {
			setIsAuth(true)
		}

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
		<>
			<AuthContext.Provider value={{ isAuth, setIsAuth }}>
				<HashRouter>
					{isAuth && (
						<Routes>
							<Route path='/' element={<MainPage eventsList={eventsList} enterCount={enterCount} exitCount={exitCount} anomaliesIn={anomaliesIn} anomaliesOut={anomaliesOut} />} />
							<Route path='/login' element={<LoginPage />} />
							<Route path='/users' element={<UsersPage />} />
							<Route path='/keys' element={<KeysPage />} />
							<Route path='*' element={<ErrorPage />} />
						</Routes>
					)}
					{!isAuth && (
						<Routes>
							<Route path='/' element={<LoginPage />} />
							<Route path='*' element={<LoginPage />} />
						</Routes>
					)}
				</HashRouter>
			</AuthContext.Provider>
			{createPortal(
				<ErrorModal />,
				document.body
			)}
		</>
	)
}



