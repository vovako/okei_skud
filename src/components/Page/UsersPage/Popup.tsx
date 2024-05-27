import useGroups from '@/hooks/useGroups';
import useUsers, { loadUsers, addUser, Iuser } from '@/hooks/useUsers';
import { ReactElement, useState } from 'react';

interface IPopup {
	children: ReactElement,
	id: string
}
function Popup({ children, id }: IPopup) {
	function onClickClose(evt: MouseEvent) {
		const target = evt.target as HTMLElement
		target.closest('.popup')!.classList.remove('active')
	}

	return (
		<div className='popup' id={id}>
			<button onClick={onClickClose as any} className="popup__close-btn">Закрыть</button>
			{children}
		</div>
	);
}

export function PopupAddUser() {
	const { groups } = useGroups()

	const [surname, setSurname] = useState('')
	const [firstname, setFirstname] = useState('')
	const [lastname, setLastname] = useState('')
	const [groupId, setGroupId] = useState(0)

	function onClickAddUserBtn(evt: MouseEvent) {
		const target = evt.target as HTMLElement
		const statusEl = target.closest('.popup')!.querySelector('.popup__action-status') as HTMLElement
		statusEl.classList.remove('failed', 'success')

		if (!(firstname && surname && lastname && groupId)) return;

		addUser(firstname, surname, lastname, groupId)
			.then(_ => {
				statusEl.classList.add('success')
			})
			.catch(_ => {
				statusEl.classList.add('failed')
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
			<>
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
					<select value={groupId} onChange={(evt) => setGroupId(+evt.target.value)}>
						<option value="0">Все</option>
						{groups.map(g => <option key={g.Id} value={g.Id}>{g.Name}</option>)}
					</select>
				</label>
				<div className="popup__footer">
					<div className="popup__action-status"></div>
					<button onClick={onClickAddUserBtn as any} className="btn btn_green">Добавить</button>
				</div>
			</>
		</Popup>
	);
};

interface IPopupFilter {
	setFilterCount: React.Dispatch<React.SetStateAction<number>>,
	filterCount: number,
	setFilteredList: React.Dispatch<React.SetStateAction<number[]>>
}
export function PopupFilter({ setFilterCount, filterCount, setFilteredList }: IPopupFilter) {
	const { groups } = useGroups()
	const { addUsers } = useUsers()

	const [surname, setSurname] = useState('')
	const [firstname, setFirstname] = useState('')
	const [lastname, setLastname] = useState('')
	const [groupId, setGroupId] = useState(0)

	function onClickSubmit(evt: MouseEvent) {
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
			.then(data => {
				const newUser = data as Iuser[]
				addUsers(data)
				setFilteredList(data !== null ? newUser.map(u => u.Id) : [])
			})
		setFilterCount(filterCount)

		const target = evt.target as HTMLElement
		target.closest('.popup')!.classList.remove('active')
	}

	function onResetClick(evt: MouseEvent) {
		setSurname('')
		setFirstname('')
		setLastname('')
		setGroupId(0)
		setFilterCount(0)
		const target = evt.target as HTMLElement
		target.closest('.popup')!.classList.remove('active')
	}

	return (
		<Popup id={'filter-popup'} >
			<>
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
					<select value={groupId} onChange={(evt) => setGroupId(+evt.target.value)}>
						<option value="0">Все</option>
						{groups.map(g => <option key={g.Id} value={g.Id}>{g.Name}</option>)}
					</select>
				</label>
				<div className="popup__footer">
					<button onClick={onResetClick as any} className={`popup__link-btn link-btn ${filterCount > 0 && 'active'}`}>Сбросить</button>
					<button onClick={onClickSubmit as any} className="btn btn_green">Поиск</button>
				</div>
			</>
		</Popup>
	);
};