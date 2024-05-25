import './users-page.scss'
import { useRef, useState } from 'react'
import MonthChart from '../../MonthChart/MonthChart'
import Chart from 'react-google-charts'
import moment from 'moment'
import 'moment/dist/locale/ru.js';
moment.locale('ru')
import Header from '../Header/Header'
import loadingIcon from '@images/loading.gif'
import UsersBlock from './UsersBlock'
import useGroups from '@hooks/useGroups'
import { request } from '@/utils/request'
import useUsers from '@/hooks/useUsers'

export default function UsersPage() {
	const [selectedUserTitle, setSelectedUserTitle] = useState('не выбран')
	const [comesIsLoading, setComesIsLoading] = useState(false)
	const [dayInfoIsLoading, setDayInfoIsLoading] = useState(false)

	const [prevMonthData, setPrevMonthData] = useState<any[]>([])
	const [curMonthData, setCurMonthData] = useState<any[]>([])
	const [dayComesInfo, setDayComesInfo] = useState<any[]>([])

	const activeUserIdRef = useRef<number | null>(null)
	const selectedDate = useRef(moment())
	const { users, usersIsLoading } = useUsers()
	const { groups } = useGroups()



	function onClickUser(id: number) {
		activeUserIdRef.current = id
		const user = users.filter((u) => u.Id === id)[0]
		const groupName = groups.filter((g) => g.Id === user.DepartmentId)[0]?.Name ?? 'Без группы'
		setSelectedUserTitle(`${user.LastName} ${user.FirstName} ${user.MiddleName} ${groupName}`)
		setComesIsLoading(true)

		let comesLoadedMonths = 0

		loadComesPerMonth(moment(), id)
			.then((data: any) => {
				setCurMonthData(data)
				comesLoadedMonths += 1
				if (comesLoadedMonths === 2) {
					setComesIsLoading(false)
				}
			})

		loadComesPerMonth(moment().month(moment().month() - 1), id)
			.then((data: any) => {
				setPrevMonthData(data)
				comesLoadedMonths += 1
				if (comesLoadedMonths === 2) {
					setComesIsLoading(false)
				}
			})

		onSelectDate(moment())
	}





	function loadComesPerMonth(date: moment.Moment, userId: number) {
		return new Promise((resolve) => {
			request(`/api/persons/activity/monthly/${date.format()}/${userId}`)
				.then(data => {
					const comesPerMonth = data ?? []
					resolve(comesPerMonth)
				})
		})
	}

	function loadComesPerDay(date: moment.Moment, userId: number) {
		return new Promise((resolve) => {
			request(`/api/persons/activity/dayly/${date.format()}/${userId}`)
				.then(data => {
					const comesPerDay = (data ?? []) as any[]
					resolve(comesPerDay)
				})
		})
	}

	function onSelectDate(date: moment.Moment) {
		selectedDate.current = date.clone()
		setDayInfoIsLoading(true)
		loadComesPerDay(date, activeUserIdRef.current!)
			.then((data: any) => {
				const dataFormat: any[] = []
				const toFormat = (m: moment.Moment) => moment(m).second(0).millisecond(0).toDate();
				function createTooltip(title: string, range: string) {
					return `<div class="tooltip-title">${title}</div>` +
						`<div class="tooltip-range" style="font-size: 1.6rem;">${range}</div>`;
				}
				data.forEach((info: any, i: number) => {
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
								{!comesIsLoading && activeUserIdRef.current !== null && (
									<>
										<MonthChart date={moment().month(moment().month() - 1)} data={prevMonthData} onSelectDate={onSelectDate} />
										<MonthChart date={moment()} data={curMonthData} onSelectDate={onSelectDate} />
									</>
								)}
								{comesIsLoading && activeUserIdRef.current !== null && (
									<img src={loadingIcon} alt="" className={`loading ${usersIsLoading ? 'active' : ''}`} />
								)}
							</div>
						</div>
						<div className="block info-per-day">
							<div className="block__header">Информация за <span>{moment().format('DD.MM.YYYY')}</span></div>
							<div className="block__content">
								{!dayInfoIsLoading && activeUserIdRef.current !== null && dayComesInfo.length > 1 && (
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
								{!dayInfoIsLoading && activeUserIdRef.current !== null && dayComesInfo.length <= 1 && (
									'Нет информации'
								)}
								{dayInfoIsLoading && activeUserIdRef.current !== null && (
									<img src={loadingIcon} alt="" className={`loading ${usersIsLoading ? 'active' : ''}`} />
								)}
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