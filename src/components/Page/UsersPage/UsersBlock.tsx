import { useState, useRef, ChangeEvent, RefObject } from 'react'
import { createPortal } from "react-dom"
import { PopupAddUser, PopupFilter } from './Popup'
import filterImg from '@images/filter.svg'
import loadingIcon from '@images/loading.gif'
import useUsers, { loadUsers } from '@hooks/useUsers'

interface IUsersBlock {
	onClickUser: any,
	activeUserIdRef: RefObject<number | null>
}

const UsersBlock = ({ onClickUser, activeUserIdRef }: IUsersBlock) => {
	const [filterCount, setFilterCount] = useState(0)
	const [filteredList, setFilteredList] = useState<number[]>([])
	const [searchValue, setSearchValue] = useState('')
	const { users, usersIsLoading, addUsers, setUsersIsLoading } = useUsers()

	const searchTimeout = useRef<number>()

	function onChangeSearchInput(evt: ChangeEvent) {
		const target = evt.target as HTMLInputElement
		setSearchValue(target.value)
		clearTimeout(searchTimeout.current)
		searchTimeout.current = setTimeout(() => {

			const params = [
				`LastName=${target.value}`
			]
			setUsersIsLoading(true)
			loadUsers(0, 100, params)
				.then(newUsers => {
					addUsers(newUsers)
					setFilterCount(0)
					setUsersIsLoading(false)
				})

		}, 400)

	}

	function onClickOpenAddUserPopup(evt: MouseEvent) {
		const target = evt.target as HTMLElement
		const sourceRect = target.getBoundingClientRect()
		const addPopupEl = target.closest('body')!.querySelector('#add-user-popup') as HTMLElement
		addPopupEl.style.right = document.documentElement.clientWidth - sourceRect.right + 'px'
		addPopupEl.style.top = sourceRect.top + 'px'
		addPopupEl.classList.add('active')
	}

	function onClickOpenFilterPopup(evt: MouseEvent) {
		const target = evt.target as HTMLElement
		const sourceRect = target.getBoundingClientRect()
		const filterPopupEl = target.closest('body')!.querySelector('#filter-popup') as HTMLElement
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
							<button onClick={onClickOpenFilterPopup as any} className="users-filter__btn btn btn_green">
								<img src={filterImg} alt="" />
								<div className="users-filter__label">{filterCount > 0 && filterCount}</div>
							</button>
							<div className="users-filter__popup"></div>
						</div>
					</div>
					<div className="users-list">
						<div className="users-list__actions">
							<button onClick={onClickOpenAddUserPopup as any} className="btn btn_green users-list__add-btn">Добавить</button>
						</div>
						<div className="users-list__list">
							{[...users].filter((user) => filterCount > 0 ? filteredList.includes(user.Id) : user.LastName.toLowerCase().includes(searchValue.toLowerCase())).map(user => (
								<div className={`users-list__item ${activeUserIdRef.current === user.Id ? 'active' : ''}`}
									onClick={() => onClickUser(user.Id)}
									key={user.Id} >{user.LastName} {user.FirstName} {user.MiddleName}</div>
							))}
						</div>
					</div>
				</div>
			</div>
			{createPortal(
				<>
					<PopupAddUser />
					<PopupFilter setFilterCount={setFilterCount} filterCount={filterCount} setFilteredList={setFilteredList} />
				</>,
				document.body
			)}
		</>
	)
}

export default UsersBlock