import React, { useMemo, useRef, useState } from 'react'
import MonthChart from '../MonthChart/MonthChart'
import Chart from 'react-google-charts'
import Header from '../Header/Header'
import './users-page.scss'
import loadingIcon from '/src/assets/loading.gif'
import moment from 'moment'
import 'moment/dist/locale/ru.js';
moment.locale('ru')
import { onFetchError } from '/src/components/func/fetch';
import UsersBlock from './UsersBlock'
import useGroups from '../../hooks/useGroups'

export default function UsersPage() {
	const [usersList, setUsersList] = useState([])
	const [selectedUserTitle, setSelectedUserTitle] = useState('не выбран')
	const [usersIsLoading, setUsersIsLoading] = useState(false)
	const [comesIsLoading, setComesIsLoading] = useState(false)
	const [dayInfoIsLoading, setDayInfoIsLoading] = useState(false)
	
	const [prevMonthData, setPrevMonthData] = useState([])
	const [curMonthData, setCurMonthData] = useState([])
	const [dayComesInfo, setDayComesInfo] = useState([])
	
	const groupList = useGroups()


	const activeUserId = useRef(null)
	const selectedDate = useRef(moment())

	useMemo(() => {
		loadUsers(0, 30)
			.then(data => setGroupList(data))
	}, [])

	function loadUsers(start, count, filterProps = []) {
		setUsersIsLoading(true)
		return new Promise((resolve, reject) => {
			fetch(`${localStorage.getItem('origin')}/api/persons/filter/${start}/${count}`, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(filterProps)
			})
				.then(res => res.json())
				.then(json => {
					if (json.error) {
						onFetchError(json.error)
						reject()
					}
					const data = json.data ?? []
					addUsersInUsersList(data)
					resolve(data)
				})
				.finally(() => {
					setUsersIsLoading(false)
				})
		})
	}

	function onClickUser(id) {
		activeUserId.current = id
		const user = usersList.filter(u => u.Id === id)[0]
		const groupName = groupList.filter(g => g.Id === user.DepartmentId)[0]?.Name ?? 'Без группы'
		setSelectedUserTitle(`${user.LastName} ${user.FirstName} ${user.MiddleName} ${groupName}`)
		setComesIsLoading(true)

		let comesLoadedMonths = 0

		loadComesPerMonth(moment(), id)
			.then(data => {
				setCurMonthData(data)
				comesLoadedMonths += 1
				if (comesLoadedMonths === 2) {
					setComesIsLoading(false)
				}
			})

		loadComesPerMonth(moment().month(moment().month() - 1), id)
			.then(data => {
				setPrevMonthData(data)
				comesLoadedMonths += 1
				if (comesLoadedMonths === 2) {
					setComesIsLoading(false)
				}
			})

		onSelectDate(moment())
	}

	function addUsersInUsersList(newData) {
		if (newData === null) {
			newData = []
		}
		const uniqueData = newData.filter(nd => [...usersList].filter(ul => ul.Id === nd.Id).length < 1)
		setUsersList([...usersList, ...uniqueData])
	}

	

	function loadComesPerMonth(date, userId) {
		return new Promise((resolve, reject) => {
			fetch(`${localStorage.getItem('origin')}/api/persons/activity/monthly/${date.format()}/${userId}`, {
				credentials: 'include'
			})
				.then(res => res.json())
				.then(json => {
					if (json.error) {
						onFetchError(json.error)
						reject()
					}
					const data = json.data ?? []
					resolve(data)
				})
		})
	}

	function loadComesPerDay(date, userId) {
		return new Promise((resolve, reject) => {
			fetch(`${localStorage.getItem('origin')}/api/persons/activity/dayly/${date.format()}/${userId}`, {
				credentials: 'include'
			})
				.then(res => res.json())
				.then(json => {
					if (json.error) {
						onFetchError(json.error)
						reject()
					}
					const data = json.data ?? []
					resolve(data)
				})
		})
	}

	function onSelectDate(date) {
		selectedDate.current = date.clone()
		setDayInfoIsLoading(true)
		loadComesPerDay(date, activeUserId.current)
			.then(data => {
				const dataFormat = []
				const toFormat = (m) => moment(m).second(0).millisecond(0).toDate();
				function createTooltip(title, range) {
					return `<div class="tooltip-title">${title}</div>` +
						`<div class="tooltip-range" style="font-size: 1.6rem;">${range}</div>`;
				}
				data.forEach((info, i) => {
					const label = info.Action === 'coming' ? 'Внутри' : 'Снаружи'
					const color = info.Action === 'coming' ? '#009300' : '#d35f00'
					if (data.length === 1 || i === data.length - 1) {
						const curMoment = moment()
						const selectedMoment = moment(info.Time)
						const isToday = curMoment.month() === selectedMoment.month() && curMoment.date() === selectedMoment.date() && curMoment.hour() < 23;
						const endPoint = isToday ? toFormat(moment()) : toFormat(moment(info.Time).hour(23).minute(0));

						dataFormat.push(['Активность', '', `${createTooltip(label, moment(info.Time).format('H:mm') + ' - ' + moment(endPoint).format('H:mm'))}`, color, toFormat(info.Time), endPoint]);
					}
					if (i < data.length - 1) {
						dataFormat.push(['Активность', '', `${createTooltip(label, moment(info.Time).format('H:mm') + ' - ' + moment(data[i + 1].Time).format('H:mm'))}`, color, toFormat(info.Time), toFormat(data[i + 1].Time)])
					}
				})

				setDayComesInfo([
					[
						{ type: "string", id: 'Role' },
						{ type: "string", id: 'label' },
						{ type: "string", role: 'tooltip' },
						{ type: "string", role: 'style' },
						{ type: "date", id: 'Start' },
						{ type: "date", id: 'End' }
					],
					...dataFormat
				])
				setDayInfoIsLoading(false)
			})
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
							<div className="block__content">
								{!comesIsLoading && activeUserId.current !== null && (
									<>
										<MonthChart date={moment().month(moment().month() - 1)} data={prevMonthData} onSelectDate={onSelectDate} />
										<MonthChart date={moment()} data={curMonthData} onSelectDate={onSelectDate} />
									</>
								)}
								{comesIsLoading && activeUserId.current !== null && (
									<img src={loadingIcon} alt="" className={`loading ${usersIsLoading ? 'active' : ''}`} />
								)}
							</div>
						</div>
						<div className="block info-per-day">
							<div className="block__header">Информация за <span>{moment().format('DD.MM.YYYY')}</span></div>
							<div className="block__content">
								{!dayInfoIsLoading && activeUserId.current !== null && dayComesInfo.length > 1 && (
									<Chart
										chartType="Timeline"
										chartLanguage='ru'
										data={dayComesInfo}
										width="100%"
										height="100px"
										options={{
											hAxis: {
												format: 'H:mm',
												minValue: selectedDate.current.clone().hour(6).minute(0).second(0).millisecond(0).toDate(),
												maxValue: selectedDate.current.clone().hour(23).minute(0).second(0).millisecond(0).toDate()
											},
											alternatingRowStyle: false,
											lineWidth: 50,
										}}
									/>
								)}
								{!dayInfoIsLoading && activeUserId.current !== null && dayComesInfo.length <= 1 && (
									'Нет информации'
								)}
								{dayInfoIsLoading && activeUserId.current !== null && (
									<img src={loadingIcon} alt="" className={`loading ${usersIsLoading ? 'active' : ''}`} />
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="users-page__properties">
					<div className="title">Список студентов</div>
					{/* <UsersBlock /> */}
				</div>
			</div >
		</>
	);
}