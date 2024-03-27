import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.scss'
import arrowDown from '/src/assets/arrow.svg'

function Header() {
	const location = useLocation()
	const userName = localStorage.getItem('user-info')
	const [detailsIsOpened, setDetailsIsOpened] = useState(false)

	function onClickDetailsBtn() {
		setDetailsIsOpened(!detailsIsOpened)
	}

	function onClickExitBtn() {
		localStorage.removeItem('user-info')
		localStorage.removeItem('session')
		window.location.pathname = '/'
	}

	return (
		<header className="header">
			<div className="logo">ОКЭИ СКУД</div>
			<div className="menu">
				<Link to='/main' className={`menu__item ${location.pathname === '/main' ? 'active' : ''}`}>Главная</Link>
				<Link to='/users' className={`menu__item ${location.pathname === '/users' ? 'active' : ''}`}>Студенты</Link>
			</div>
			<div className="profile">
				<button onClick={onClickDetailsBtn} className="profile__open-btn">
					<div className="profile__name">{userName}</div>
					<img src={arrowDown} alt="" className="profile__details" />
				</button>
				<div className={`profile__popup ${detailsIsOpened ? 'active' : ''}`}>
					<button onClick={onClickExitBtn} className="profile__popup-btn">Выйти</button>
				</div>
			</div>
		</header>
	);
}

export default Header;