import React from 'react';
import { Link } from 'react-router-dom';
import './error-page.scss';

function ErrorPage() {
	return (
		<div className="error-page">
			<div className="error-page__container">
				<div className="error-page__title">Страница не найдена</div>
				<Link to="/" className="error-page__back-btn">Назад на главную</Link>
			</div>
		</div>
	);
}

export default ErrorPage;