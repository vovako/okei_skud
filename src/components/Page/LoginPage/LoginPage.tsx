import { useState } from 'react';
import './login-page.scss'
import useAuth from '@hooks/useAuth';
import { request } from '@utils/request';

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
		setNotice('')

		if (loginValue.trim() === '' || passValue.trim() === '') {

			setNotice('Не все поля заполнены')
			return;
		}

		if (!(loginValue.trim() === 'Izumra' && passValue.trim() === '!Izumra17.')) {

			setNotice('Неправильный логин или пароль')
			return;
		}

		const loginBody = {
			"username": loginValue,
			"password": passValue
		}
		request('/login', 'post', loginBody)
			.then((data: any) => {
				localStorage.setItem('user-info', data.Username)
				setIsAuth(true)
			})
			.catch(err => {
				setNotice(err)
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
							<button onClick={switchMode} className="link-btn" style={{visibility: 'hidden'}}>Регистрация</button>
							<button onClick={onLoginSubmit} className="btn login-btn">Войти</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default LoginPage;