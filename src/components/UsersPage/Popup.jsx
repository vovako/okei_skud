import React, { forwardRef, useState } from 'react';

import React from 'react';

function Popup({ children }) {
	return (
		<div ref={ref} className='popup add-user-popup'>
			<button onClick={() => ref.current.classList.remove('active')} className="popup__close-btn">Закрыть</button>
			{children}
		</div>
	);
}

export const PopupAddUser = forwardRef(({ onSessionExpired, groupList }, ref) => {
	const [surname, setSurname] = useState('')
	const [firstname, setFirstname] = useState('')
	const [lastname, setLastname] = useState('')
	const [groupId, setGroupId] = useState(0)

	function onClickAddUserBtn() {
		const statusEl = ref.current.querySelector('.popup__action-status')
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
		<div ref={ref} className='popup add-user-popup'>
			<button onClick={() => ref.current.classList.remove('active')} className="popup__close-btn">Закрыть</button>
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
		</div>
	);
});