import React, { useState } from 'react';
import './login-page.scss'
import useAuth from '../../hooks/useAuth';

function LoginPage() {
	const [isRegActive, setIsRegActive] = useState(false);
	const [loginValue, setLoginValue] = useState('');
	const [passValue, setPassValue] = useState('');
	const [notice, setNotice] = useState('');
	const { setIsAuth } = useAuth()

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
			credentials: 'include',
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
				localStorage.setItem('user-info', json.data.Username)
				setIsAuth(true)
			})
	}

	return (
		<div className="login">
			<div className="login-form">
				{isRegActive && (
					<>
						<div className="login-form__title">Регистрация</div>
						<input value={loginValue} onChange={(evt) => setLoginValue(evt.target.value)} type="text" className="login-form__input" autoComplete="username" placeholder='Логин' />
						<input value={passValue} onChange={(evt) => setPassValue(evt.target.value)} type="password" className="login-form__input" autoComplete="password" placeholder='Пароль' />
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
						<input value={loginValue} onChange={(evt) => setLoginValue(evt.target.value)} type="text" className="login-form__input" autoComplete="username" placeholder='Логин' />
						<input value={passValue} onChange={(evt) => setPassValue(evt.target.value)} type="password" className="login-form__input" autoComplete="password" placeholder='Пароль' />
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