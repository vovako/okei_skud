import React from 'react';
import './login-page.scss'

function LoginPage() {
	return (
		<div className="login">
			<div className="login-form">
				<input type="text" className="login-form__input" placeholder='Логин'/>
				<input type="password" className="login-form__input" placeholder='Пароль' />
				<button className="login-form__submit-btn btn">Войти</button>
			</div>
		</div>
	);
}

export default LoginPage;