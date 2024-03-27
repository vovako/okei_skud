import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login-page.scss'

function LoginPage() {
	const [isRegActive, setIsRegActive] = useState(false);
	const [loginValue, setLoginValue] = useState('');
	const [passValue, setPassValue] = useState('');
	const [notice, setNotice] = useState('');

	const navigate = useNavigate()

	function switchMode() {
		setIsRegActive(!isRegActive)
		setLoginValue('')
		setPassValue('')
		setNotice('')
	}

	function onLoginSubmit() {
		if (loginValue.trim() === '' && passValue.trim() === '') return;

		fetch(`${localStorage.getItem('origin')}/login`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"username": loginValue,
				"password": passValue
			})
		})
			.then(res => res.json())
			.then(json => {
				setNotice('')
				if (json.error !== null) {
					setNotice(json.error)
					return
				}
				localStorage.setItem('session', json.data)
				localStorage.setItem('user-info', json.data)
				navigate('/main', { replace: false })
			})
	}


	useEffect(() => {
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
				if (json.error === null) {
					localStorage.setItem('user-info', json.data)
					navigate('/main', { replace: false })
				}
			})
	}, [])

	return (
		<div className="login">
			<div className="login-form">
				{isRegActive && (
					<>
						<div className="login-form__title">Регистрация</div>
						<input value={loginValue} onChange={(evt) => setLoginValue(evt.target.value)} type="text" className="login-form__input" placeholder='Логин' />
						<input value={passValue} onChange={(evt) => setPassValue(evt.target.value)} type="password" className="login-form__input" placeholder='Пароль' />
						<div className="login-form__notice">{notice}</div>
						<div className="login-form__footer">
							<button onClick={switchMode} className="link-btn">Вход</button>
							<button className="btn">Зарегистрироваться</button>
						</div>
					</>
				)}
				{!isRegActive && (
					<>
						<div className="login-form__title">Вход</div>
						<input value={loginValue} onChange={(evt) => setLoginValue(evt.target.value)} type="text" className="login-form__input" placeholder='Логин' />
						<input value={passValue} onChange={(evt) => setPassValue(evt.target.value)} type="password" className="login-form__input" placeholder='Пароль' />
						<div className="login-form__notice">{notice}</div>
						<div className="login-form__footer">
							<button onClick={switchMode} className="link-btn">Регистрация</button>
							<button onClick={onLoginSubmit} className="btn">Войти</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default LoginPage;