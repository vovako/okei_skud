import React, { useEffect, useMemo, useRef, useState } from 'react'
import Chart from 'react-google-charts'
import Header from '../Header/Header'
import './users-page.scss'
import filterImg from '/src/assets/filter.svg'
import { PopupAddUser, PopupFilter } from './Popup'
import loadingIcon from '/src/assets/loading.gif'
import moment from 'moment'
import 'moment/dist/locale/ru.js';
moment.locale('ru')

function UsersPage({ onSessionExpired }) {
	const [usersList, setUsersList] = useState([])
	const [activeUserId, setActiveUserId] = useState(null)
	const [selectedUserTitle, setSelectedUserTitle] = useState('не выбран')
	const [searchValue, setSearchValue] = useState('')
	const [groupList, setGroupList] = useState([])
	const [usersIsLoading, setUsersIsLoading] = useState(false)
	const [comesIsLoading, setComesIsLoading] = useState(false)
	const [dayInfoIsLoading, setDayInfoIsLoading] = useState(false)
	const [filterCount, setFilterCount] = useState(0)
	const [filteredList, setFilteredList] = useState([])

	const searchTimeout = useRef({})

	useMemo(() => {
		loadUsers(0, 30)
		loadGroup()
	}, [])



	function loadUsers(start, count, filterProps = []) {
		return new Promise(resolve => {
			setUsersIsLoading(true)
			fetch(`${localStorage.getItem('origin')}/api/persons/filter/${start}/${count}`, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('session')
				},
				body: JSON.stringify(filterProps)
			})
				.then(res => res.json())
				.then(json => {
					if (json.error) {
						console.warn(json.error)
						if (json.error === 'сессия пользователя не действительна') {
							onSessionExpired()
						}
					}
					addUsersInUsersList(json.data)
					resolve(json.data)
				})
				.finally(() => {
					setUsersIsLoading(false)
				})
		})
	}

	function loadGroup() {
		fetch(`${localStorage.getItem('origin')}/api/persons/departments`, {
			headers: {
				'Authorization': localStorage.getItem('session')
			},
		})
			.then(res => res.json())
			.then(json => {
				if (json.error) {
					console.warn(json.error)
					if (json.error === 'сессия пользователя не действительна') {
						onSessionExpired()
					}
				}
				setGroupList(json.data)
			})
	}

	function onClickUser(id) {
		setActiveUserId(id)
		const user = usersList.filter(u => u.Id === id)[0]
		setSelectedUserTitle(`${user.LastName} ${user.FirstName} ${user.MiddleName}`)
		setComesIsLoading(true)
		setDayInfoIsLoading(true)
	}

	function onClickOpenAddUserPopup(evt) {
		const sourceRect = evt.target.getBoundingClientRect()
		const addPopupEl = evt.target.closest('body').querySelector('#add-user-popup')
		addPopupEl.style.right = document.documentElement.clientWidth - sourceRect.right + 'px'
		addPopupEl.style.top = sourceRect.top + 'px'
		addPopupEl.classList.add('active')
	}

	function onClickOpenFilterPopup(evt) {
		const sourceRect = evt.target.getBoundingClientRect()
		const filterPopupEl = evt.target.closest('body').querySelector('#filter-popup')
		filterPopupEl.style.right = document.documentElement.clientWidth - sourceRect.right + 'px'
		filterPopupEl.style.top = sourceRect.top + 'px'
		filterPopupEl.classList.add('active')
	}

	function addUsersInUsersList(newData) {
		if (newData === null) {
			newData = []
		}
		const uniqueData = newData.filter(nd => [...usersList].filter(ul => ul.Id === nd.Id).length < 1)
		setUsersList([...usersList, ...uniqueData])
	}

	function onChangeSearchInput(evt) {
		setSearchValue(evt.target.value)
		clearTimeout(searchTimeout.current)
		searchTimeout.current = setTimeout(() => {

			const params = [
				`LastName=${evt.target.value}`
			]
			loadUsers(0, 100, params)
				.then(_ => setFilterCount(0))

		}, 400)

	}

	function loadComesPerMonth(month, userId) {
		return new Promise(resolve => {
			fetch(`${localStorage.getItem('origin')}/api/persons/departments`, {
				headers: {
					'Authorization': localStorage.getItem('session')
				},
			})
				.then(res => res.json())
				.then(json => {
					if (json.error) {
						console.warn(json.error)
						if (json.error === 'сессия пользователя не действительна') {
							onSessionExpired()
						}
					}
					resolve(json.data)
				})
		})
	}

	return (
		<>
			<Header />
			<div className="users-page">
				<div className="users-page__body">
					<div className="title">Студент <span>{selectedUserTitle}{activeUserId !== null && ` (${groupList
						.filter(g => g.Id === activeUserId)[0]?.Name ?? 'Без группы'})`}</span></div>
					<div className='wrapper'>
						<div className="block comes-block">
							<div className="block__header">Приходы</div>
							<div className="block__content">
								{!comesIsLoading && !activeUserId !== null && (
									<>
										<MonthChart date={moment().month(moment().month() - 1)} />
										<MonthChart date={moment()} />
									</>
								)}
								{comesIsLoading && activeUserId !== null && (
									<img src={loadingIcon} alt="" className={`loading ${usersIsLoading ? 'active' : ''}`} />
								)}
							</div>
						</div>
						<div className="block info-per-day">
							<div className="block__header">Информация за <span>{moment().format('DD.MM.YYYY')}</span></div>
							<div className="block__content">
								{dayInfoIsLoading && activeUserId !== null && (
									<img src={loadingIcon} alt="" className={`loading ${usersIsLoading ? 'active' : ''}`} />
								)}
							</div>
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
										onChange={onChangeSearchInput} />
								</search>
								<img src={loadingIcon} alt="" className={`loading ${usersIsLoading ? 'active' : ''}`} />
								<div className="users-search-row__filter users-filter">
									<button onClick={onClickOpenFilterPopup} className="users-filter__btn btn btn_green">
										<img src={filterImg} alt="" />
										<div className="users-filter__label">{filterCount > 0 && filterCount}</div>
									</button>
									<div className="users-filter__popup"></div>
								</div>
							</div>
							<div className="users-list">
								<div className="users-list__actions">
									<button onClick={onClickOpenAddUserPopup} className="btn btn_green">Добавить</button>
								</div>
								<div className="users-list__list">
									{[...usersList].filter(user => filterCount > 0 ? filteredList.includes(user.Id) : user.LastName.toLowerCase().includes(searchValue.toLowerCase())).map(user => (
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
			<PopupAddUser onSessionExpired={onSessionExpired} groupList={groupList} />
			<PopupFilter groupList={groupList} loadUsers={loadUsers} setFilterCount={setFilterCount} filterCount={filterCount} setFilteredList={setFilteredList} />
		</>
	);
}

function MonthChart({ date }) {
	const monthTitle = date.format('MMMM')
	const daysCount = +date.endOf('month').format('DD')
	const prevMonthDaysCount = +date.startOf('month').format('d') - 1
	const curDay = moment().month() === date.month() ? moment().day() : 0

	function onSelectDay(evt) {
		if (!evt.target.classList.contains('selected')) {
			document.querySelector('.comes-grid__item.selected').classList.remove('selected')
			evt.target.classList.add('selected')
			const curDate = moment(date)
			curDate.date(+evt.target.textContent)
			document.querySelector('.info-per-day .block__header span').textContent = curDate.format('DD.MM.YYYY')
		}
	}

	return (
		<div className="comes-grid">
			<div className="comes-grid__title">{monthTitle}</div>
			<div className="comes-grid__body">
				<div className="comes-grid__item head">Пн</div>
				<div className="comes-grid__item head">Вт</div>
				<div className="comes-grid__item head">Ср</div>
				<div className="comes-grid__item head">Чт</div>
				<div className="comes-grid__item head">Пт</div>
				<div className="comes-grid__item head">Сб</div>
				<div className="comes-grid__item head">Вс</div>
				{Array.from({ length: prevMonthDaysCount }).map((_, i) => (
					<div key={i} className="comes-grid__item old"></div>
				))}
				{Array.from({ length: daysCount }).map((_, i) => (
					<div onClick={onSelectDay} key={i} className={`comes-grid__item ${curDay === i + 1 ? 'selected' : ''}`}>{i + 1}</div>
				))}
			</div>
		</div>
	);
}

export default UsersPage;