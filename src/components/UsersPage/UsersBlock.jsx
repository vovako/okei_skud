import { useState, useRef } from 'react'
import { createPortal } from "react-dom"
import { PopupAddUser, PopupFilter } from './Popup'
import filterImg from '/src/assets/filter.svg'
import loadingIcon from '/src/assets/loading.gif'
import { onFetchError } from '/src/components/func/fetch';

const UsersBlock = () => {

	const [filterCount, setFilterCount] = useState(0)
	const [filteredList, setFilteredList] = useState([])
	const [searchValue, setSearchValue] = useState('')

	const searchTimeout = useRef({})

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

	return (
		<>
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
							<button onClick={onClickOpenAddUserPopup} className="btn btn_green users-list__add-btn">Добавить</button>
						</div>
						<div className="users-list__list">
							{[...usersList].filter(user => filterCount > 0 ? filteredList.includes(user.Id) : user.LastName.toLowerCase().includes(searchValue.toLowerCase())).map(user => (
								<div className={`users-list__item ${activeUserId.current === user.Id ? 'active' : ''}`}
									onClick={() => onClickUser(user.Id)}
									key={user.Id} >{user.LastName} {user.FirstName} {user.MiddleName}</div>
							))}
						</div>
					</div>
				</div>
			</div>
			{createPortal(
				<>
					<PopupAddUser onFetchError={onFetchError} groupList={groupList} />
					<PopupFilter groupList={groupList} loadUsers={loadUsers} setFilterCount={setFilterCount} filterCount={filterCount} setFilteredList={setFilteredList} />
				</>,
				document.body
			)}
		</>
	)
}

export default UsersBlock