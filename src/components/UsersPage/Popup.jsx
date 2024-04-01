import React, { useState } from 'react';

function Popup({ children, id }) {

	function onClickClose(evt) {
		evt.target.closest('.popup').classList.remove('active')
	}

	return (
		<div className='popup' id={id}>
			<button onClick={onClickClose} className="popup__close-btn">Закрыть</button>
			{children}
		</div>
	);
}

export function PopupAddUser({ onSessionExpired, groupList }) {
	const [surname, setSurname] = useState('')
	const [firstname, setFirstname] = useState('')
	const [lastname, setLastname] = useState('')
	const [groupId, setGroupId] = useState(0)

	function onClickAddUserBtn(evt) {
		const statusEl = evt.target.closest('.popup').querySelector('.popup__action-status')
		statusEl.classList.remove('failed')
		statusEl.classList.remove('success')

		fetch(`${localStorage.getItem('origin')}/api/persons`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.getItem('session')
			},
			body: JSON.stringify({
				"FirstName": firstname,
				"LastName": surname,
				"MiddleName": lastname,
				"DepartmentId": +groupId
			})
		})
			.then(res => res.json())
			.then(json => {
				if (json.error) {
					console.warn(json.error)
					if (json.error === 'сессия пользователя не действительна') {
						onSessionExpired()
					} else {
						statusEl.classList.add('failed')
					}

					return null
				}
				statusEl.classList.add('success')
			})
			.finally(() => {
				setSurname('')
				setFirstname('')
				setLastname('')
				setGroupId(0)
			})
	}

	return (
		<Popup id={'add-user-popup'} >
			<input type="text"
				className="popup__input input"
				placeholder='Фамилия'
				value={surname}
				onChange={(evt) => setSurname(evt.target.value)} />
			<input type="text"
				className="popup__input input"
				placeholder='Имя'
				value={firstname}
				onChange={(evt) => setFirstname(evt.target.value)} />
			<input type="text"
				className="popup__input input"
				placeholder='Отчество'
				value={lastname}
				onChange={(evt) => setLastname(evt.target.value)} />
			<label>
				<span>Группа</span>
				<select value={groupId} onChange={(evt) => setGroupId(evt.target.value)}>
					<option value="0">Все</option>
					{groupList.map(g => <option key={g.Id} value={g.Id}>{g.Name}</option>)}
				</select>
			</label>
			<div className="popup__footer">
				<div className="popup__action-status"></div>
				<button onClick={onClickAddUserBtn} className="btn btn_green">Добавить</button>
			</div>
		</Popup>
	);
};


export function PopupFilter({ groupList, loadUsers, setFilterCount, filterCount, setFilteredList }) {
	const [surname, setSurname] = useState('')
	const [firstname, setFirstname] = useState('')
	const [lastname, setLastname] = useState('')
	const [groupId, setGroupId] = useState(0)

	function onClickSubmit(evt) {
		const opts = []
		if (groupId !== 0) opts.push(`DepartmentId=${groupId}`)
		if (firstname.length > 0) opts.push(`FirstName=${firstname}`)
		if (surname.length > 0) opts.push(`LastName=${surname}`)
		if (lastname.length > 0) opts.push(`MiddleName=${lastname}`)

		const filterCount = +(surname.trim().length > 0)
			+ +(firstname.trim().length > 0)
			+ +(lastname.trim().length > 0)
			+ +(groupId > 0)

		loadUsers(0, filterCount > 0 ? 100 : 30, opts)
			.then(data => setFilteredList(data !== null ? data.map(u => u.Id) : []))
		setFilterCount(filterCount)

		evt.target.closest('.popup').classList.remove('active')
	}

	function onResetClick(evt) {
		setSurname('')
		setFirstname('')
		setLastname('')
		setGroupId(0)
		setFilterCount(0)
		evt.target.closest('.popup').classList.remove('active')
	}

	return (
		<Popup id={'filter-popup'} >
			<input type="text"
				className="popup__input input"
				placeholder='Фамилия'
				value={surname}
				onChange={(evt) => setSurname(evt.target.value)} />
			<input type="text"
				className="popup__input input"
				placeholder='Имя'
				value={firstname}
				onChange={(evt) => setFirstname(evt.target.value)} />
			<input type="text"
				className="popup__input input"
				placeholder='Отчество'
				value={lastname}
				onChange={(evt) => setLastname(evt.target.value)} />
			<label>
				<span>Группа</span>
				<select value={groupId} onChange={(evt) => setGroupId(evt.target.value)}>
					<option value="0">Все</option>
					{groupList.map(g => <option key={g.Id} value={g.Id}>{g.Name}</option>)}
				</select>
			</label>
			<div className="popup__footer">
				<button onClick={onResetClick} className={`popup__link-btn link-btn ${filterCount > 0 && 'active'}`}>Сбросить</button>
				<button onClick={onClickSubmit} className="btn btn_green">Поиск</button>
			</div>
		</Popup>
	);
};