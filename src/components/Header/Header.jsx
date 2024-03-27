import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.scss'

function Header() {
	const location = useLocation()

	useEffect(() => {
		console.log(location.pathname);
	}, [location])

	return (
		<header className="header">
			<div className="logo">ОКЭИ СКУД</div>
			<div className="menu">
				<Link to='/main' className={`menu__item ${location.pathname === '/main' ? 'active' : ''}`}>Главная</Link>
				<Link to='/users' className={`menu__item ${location.pathname === '/users' ? 'active' : ''}`}>Студенты</Link>
			</div>
		</header>
	);
}

export default Header;