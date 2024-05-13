import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom'
import './App.scss'
import LoginPage from '@components/Page/LoginPage/LoginPage'
import ErrorPage from '@components/Page/ErrorPage/ErrorPage'
import MainPage from '@components/Page/MainPage/MainPage'
import UsersPage from '@components/Page/UsersPage/UsersPage'
import KeysPage from '@components/Page/KeysPage/KeysPage'
import { ErrorModal } from '@components/ModalDialog/ModalDialog'
import { onFetchError, wsorigin } from '@utils/request'

import { useAuth } from '@hooks/useAuth'

export default function App() {

	const [eventsList, setEventsList] = useState([])
	const [enterCount, setEnterCount] = useState(0)
	const [exitCount, setExitCount] = useState(0)
	const [anomaliesIn, setAnomaliesIn] = useState(1)
	const [anomaliesOut, setAnomaliesOut] = useState(1)
	const { isAuth } = useAuth()

	function updateEventsList(newData: never[]) {
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
		const ws = new WebSocket(`${wsorigin}/api/ws/monitor`)

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

		document.addEventListener('click', (evt) => {
			const target = evt.target as HTMLElement

			if (!target.closest('.profile') && document.querySelector('.profile')) {
				document.querySelector('.profile')?.classList.remove('active')
			}
			if (!target.closest('.popup') && document.querySelector('.popup.active')) {
				if (!target.closest('#add-user-popup') && !target.classList.contains('users-list__add-btn')) {
					document.querySelector('#add-user-popup')?.classList.remove('active')
				}
				if (!target.closest('#filter-popup') && !target.classList.contains('users-filter__btn')) {
					document.querySelector('#filter-popup')?.classList.remove('active')
				}
			}
		})
	}, [])

	return (
		<>
			<HashRouter>
				<Routes>
					<Route path='/' element={isAuth ? <MainPage eventsList={eventsList} enterCount={enterCount} exitCount={exitCount} anomaliesIn={anomaliesIn} anomaliesOut={anomaliesOut} /> : <Navigate replace to={'/login'} />} />
					<Route path='/login' element={!isAuth ? <LoginPage /> : <Navigate replace to={'/'} />} />
					<Route path='/users' element={isAuth ? <UsersPage /> : <Navigate replace to={'/login'} />} />
					<Route path='/keys' element={isAuth ? <KeysPage /> : <Navigate replace to={'/login'} />} />
					<Route path='*' element={<ErrorPage />} />
				</Routes>
			</HashRouter>
			{createPortal(
				<ErrorModal />,
				document.body
			)}
		</>
	)
}



