import React from 'react';
import Header from '../Header/Header';
import { PopupFilter } from '../UsersPage/Popup';

function KeysPage({ onFetchError }) {
	return (
		<>
			<Header />
			<div className="users-page">
				<div className="users-page__body">
					<div className='wrapper'>
						<div className="block keys-info-block">
							<div className="block__content">
							</div>
						</div>
						<div className="block keys-scheme-block">
							<div className="block__content">
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
				</div>
			</div >
			<PopupFilter groupList={groupList} loadUsers={loadUsers} setFilterCount={setFilterCount} filterCount={filterCount} setFilteredList={setFilteredList} />
		</>
	);
}

export default KeysPage;