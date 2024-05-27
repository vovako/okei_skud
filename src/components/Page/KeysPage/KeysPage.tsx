import './keys-page.scss'
import Header from '../Header/Header';
import UsersBlock from '../UsersPage/UsersBlock';
import { useRef, useState } from 'react';
import useUsers from '@/hooks/useUsers';
import useGroups from '@/hooks/useGroups';
import kppScheme from '@images/kpp.png'
import loadingIcon from '@images/loading.gif'
import { request } from '@/utils/request';

function KeysPage() {
	const [selectedUserTitle, setSelectedUserTitle] = useState('не выбран')
	const activeUserIdRef = useRef<number | null>(null)
	const [activeReader, setActiveReader] = useState<number | null>(null)
	const [bindingState, setBindingState] = useState<'disabled' | 'ready' | 'read' | 'completed' | 'failed'>('disabled')
	const { users, usersIsLoading } = useUsers()
	const { groups } = useGroups()
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
	const [groupInfo, setGroupInfo] = useState('')
	const [schemeNotice, setSchemeNotice] = useState('')
	const codeRef = useRef<number | null>(null)

	function onClickUser(id: number) {
		activeUserIdRef.current = id
		const user = users.filter((u) => u.Id === id)[0]
		setSelectedUserTitle(`${user.LastName} ${user.FirstName} ${user.MiddleName}`)

		setSelectedUserId(user.Id)
		let userGroup = groups.filter(g => g.Id === user.DepartmentId)[0]?.Name ?? ''
		if (userGroup === '') {
			userGroup = 'Без группы'
		}
		setGroupInfo(userGroup)
	}

	function onSelectReader(num: number) {
		setActiveReader(num)

		request(`/api/cards/read_card_number/${num}`, 'get', null, true)
			.then(code => {
				console.log(code)
				codeRef.current = code as number
				setBindingState('completed')
			})
			.catch(msg => {
				setSchemeNotice(msg)
				setBindingState('failed')
			})
	}

	function onClickBinding() {
		setBindingState('ready')
	}
	function onClickCancelBinding() {
		shemeReset()
	}

	function shemeReset() {
		setActiveReader(null)
		setBindingState('disabled')
		setSchemeNotice('')
	}

	function saveBinding() {
		const body = {
			PersonId: selectedUserId,
			Code: codeRef.current!
		}
		request(`/api/cards`, 'post', body)
			.then(res => {
				console.log(res)
				shemeReset()
			})
	}

	return (
		<>
			<Header />
			<div className="users-page">
				<div className="users-page__body">
					<div className="title">Привязка карты доступа</div>
					<div className='wrapper'>
						<div className="block keys-info-block">
							<div className="block__header">Информация</div>
							<div className={`block__content ${selectedUserId !== null && !usersIsLoading ? 'active' : ''}`}>
								<div className="keys-info-block__descr">
									<div className="keys-info-block__text">Студент <span>{selectedUserTitle}</span></div>
									<div className="keys-info-block__text">Группа: <span>{groupInfo}</span></div>
								</div>
								<div className="keys-info-block__actions">
									{bindingState !== 'disabled' && (
										<button onClick={onClickCancelBinding} className="btn btn_gray">Отмена привязки</button>
									)}
									{bindingState === 'disabled' && (
										<button onClick={onClickBinding} className="btn btn_green">Привязка ключа</button>
									)}
									{bindingState === 'completed' && (
										<button onClick={saveBinding} className="btn">Сохранить</button>
									)}
								</div>
								{usersIsLoading && selectedUserId !== null && (
									<img src={loadingIcon} alt="" className='loading active' />
								)}
								{selectedUserId === null && (
									<div className="block__notice">Студент не выбран</div>
								)}
							</div>
						</div>
						<div className="block reader-select-block">
							<div className="block__header">Выбор считывателя для записи</div>
							<div className="block__content">
								<div className="reader-layout-notice">{schemeNotice}</div>
								<div className={`reader-layout ${bindingState}`}>
									<img src={kppScheme} alt="" className="reader-layout__img" />
									{[1, 2, 3, 4].map((num) => (
										<button key={num} onClick={() => onSelectReader(num)} className={`reader-layout__btn ${activeReader === num ? 'selected' : ''}`} >{num}</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="users-page__properties">
					<div className="title">Список студентов</div>
					<UsersBlock onClickUser={onClickUser} activeUserIdRef={activeUserIdRef} />
				</div>
			</div >
		</>
	);
}

export default KeysPage;