import { Link, useLocation } from 'react-router-dom';
import './header.scss'
import arrowDown from '@images/arrow.svg'
import useAuth from '@hooks/useAuth';
import { request } from '@utils/request';

function Header() {
	const location = useLocation()
	const userName = localStorage.getItem('user-info')
	const { setIsAuth } = useAuth()

	function onClickDetailsBtn(event: MouseEvent) {
		const target = event.target as HTMLButtonElement
		target.closest('.profile')!.classList.toggle('active')
	}

	function onClickExitBtn() {
		localStorage.removeItem('user-info')
		request('/logout', 'post')
			.then(_ => setIsAuth(false))
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
				<button onClick={onClickDetailsBtn as any} className="profile__open-btn">
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