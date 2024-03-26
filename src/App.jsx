import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss'
import LoginPage from './components/LoginPage/LoginPage'
import ErrorPage from './components/ErrorPage/ErrorPage'
import MainPage from './components/MainPage/MainPage'

function App() {

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<LoginPage />} />
				<Route path='*' element={<ErrorPage />} />
				<Route path='/main' element={<MainPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
