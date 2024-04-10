import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './header.scss'
import arrowDown from '/src/assets/arrow.svg'
import { logOut } from '../func/fetch';

function Header() {
	const location = useLocation()
	const userName = localStorage.getItem('user-info')

	function onClickDetailsBtn(evt) {
		evt.target.closest('.profile').classList.toggle('active')
	}

	function onClickExitBtn() {
		localStorage.removeItem('user-info')
		logOut()
	}

	return (
		<header className="header">
			<div className="logo">ОКЭИ СКУД</div>
			<div className="menu">
				<Link to='/' className={`menu__item ${location.pathname === '/' ? 'active' : ''}`}><span>Главная</span></Link>
				<Link to='/users' className={`menu__item ${location.pathname === '/users' ? 'active' : ''}`}><span>Студенты</span></Link>
				<Link to='/keys' className={`menu__item ${location.pathname === '/keys' ? 'active' : ''}`}><span>Ключи</span></Link>
			</div>
			<div className='profile'>
				<button onClick={onClickDetailsBtn} className="profile__open-btn">
					<div className="profile__name">{userName}</div>
					<img src={arrowDown} alt="" className="profile__details" />
				</button>
				<div className="profile__popup">
					<button onClick={onClickExitBtn} className="profile__popup-btn">Выйти</button>
				</div>
			</div>
		</header>
	);
}

export default Header;