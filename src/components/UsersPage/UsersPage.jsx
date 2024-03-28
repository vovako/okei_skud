import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../Header/Header';
import './users-page.scss'
import filterImg from '/src/assets/filter.svg'


function UsersPage() {
	const [usersList, setUsersList] = useState([])
	const [activeUserId, setActiveUserId] = useState(null)
	const [selectedUserTitle, setSelectedUserTitle] = useState('не выбран')
	const [searchValue, setSearchValue] = useState('')
	const [addPopupOpened, setAddPopupOpened] = useState(true)

	useMemo(() => {
		loadUsers(0, 20)
	}, [])

	async function loadUsers(start, count) {
		const res = await fetch(`${localStorage.getItem('origin')}/api/persons/filter/${start}/${count}`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.getItem('session')
			},
			body: JSON.stringify([])
		})
		const json = await res.json()
		if (json.error) {
			console.warn(json.error)
			return null
		}
		setUsersList(json.data)
	}

	function onClickUser(id) {
		setActiveUserId(id)
		const user = usersList.filter(u => u.Id === id)[0]
		setSelectedUserTitle(`${user.LastName} ${user.FirstName} ${user.MiddleName}`)
	}

	return (
		<>
			<Header />
			<div className="users-page">
				<div className="users-page__body">
					<div className="title">Студент <span>{selectedUserTitle}</span></div>
					<div className='wrapper'>
						<div className="block comes-block">
							<div className="block__header">Приходы</div>
							<div className="block__content"></div>
						</div>
						<div className="block info-per-day">
							<div className="block__header">Информация за <span>28.03.2024</span></div>
							<div className="block__content"></div>
						</div>
					</div>
				</div>

				<div className="users-page__properties">
					<div className="title">Список студентов</div>
					<div className="block users-block">
						<div className="block__content">
							<div className="users-search-row">
								<search className="users-search-row__search">
									<input type="search" placeholder='Поиск по фамилии'
										value={searchValue}
										onChange={(evt) => setSearchValue(evt.target.value)} />
								</search>
								<div className="users-search-row__filter users-filter">
									<button className="users-filter__btn btn btn_green"><img src={filterImg} alt="" /></button>
									<div className="users-filter__popup"></div>
								</div>
							</div>
							<div className="users-list">
								<div className="users-list__actions">
									<button className="btn btn_green">Добавить</button>
								</div>
								<div className="users-list__list">
									{usersList.filter(user => user.LastName.toLowerCase().includes(searchValue.toLowerCase())).map((user) => (
										<div className={`users-list__item ${activeUserId === user.Id ? 'active' : ''}`}
											onClick={() => onClickUser(user.Id)}
											key={user.Id} >{user.LastName} {user.FirstName} {user.MiddleName}</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div >

			<div className={`popup add-user-popup ${addPopupOpened ? 'active' : ''}`}>
				<button onClick={() => setAddPopupOpened(false)} className="popup__close-btn">Закрыть</button>
				<input type="text" className="popup__input input" placeholder='Фамилия' />
				<input type="text" className="popup__input input" placeholder='Имя' />
				<input type="text" className="popup__input input" placeholder='Отчество' />
				<label>
					<span>Группа</span>
					<select>
						<option value="">Все</option>
						<option value="">4пк1</option>
						<option value="">4пк2</option>
					</select>
				</label>
				<div className="popup__footer">
					<div className="popup__action-status access"></div>
					<button className="btn btn_green">Добавить</button>
				</div>
			</div>
		</>
	);
}

export default UsersPage;