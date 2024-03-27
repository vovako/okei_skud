import React, { useState } from 'react';
import './login-page.scss'

function LoginPage() {
	const [isRegActive, setIsRegActive] = useState(false);
	const [loginValue, setLoginValue] = useState('');
	const [passValue, setPassValue] = useState('');

	function switchMode() {
		setIsRegActive(!isRegActive)
		setLoginValue('')
		setPassValue('')
	}

	function onLoginSubmit() {
		if (loginValue.trim() === '' && passValue.trim() === '') return;

		fetch(`${localStorage.getItem('origin')}/login`, {
			method: 'post',
			headers: {
				'Content-Type': 'applicaation/json'
			},
			body: JSON.stringify({
				"username": "Izumra",
				"password": "!Izumra17@"
			})
		})
			.then(res => res.text())
			.then(text => console.log(text))
	}

	return (
		<div className="login">
			<div className="login-form">
				{isRegActive && (
					<>
						<div className="login-form__title">Регистрация</div>
						<input value={loginValue} onChange={(evt) => setLoginValue(evt.target.value)} type="text" className="login-form__input" placeholder='Логин' />
						<input value={passValue} onChange={(evt) => setPassValue(evt.target.value)} type="password" className="login-form__input" placeholder='Пароль' />
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