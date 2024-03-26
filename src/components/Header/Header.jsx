import React from 'react';
import './header.scss'

function Header() {
	return (
		<header className="header">
			<div className="logo">ОКЭИ СКУД</div>
			<div className="menu">
				<a href="./" className="menu__item active">Главная</a>
				<a href="./students.html" className="menu__item">Студенты</a>
			</div>
		</header>
	);
}

export default Header;