import React, { useMemo, useState } from 'react';
import './main-page.scss'
import Header from '../Header/Header';
import Chart from 'react-google-charts';
import moment from 'moment'
import 'moment/dist/locale/ru.js';
moment.locale('ru')

function MainPage({ onFetchError }) {

	const [eventsList, setEventsList] = useState([])

	function updateEventsList(newData) {
		setEventsList(prev => {
			const temp = [...prev]
			temp.push(...newData)
			if (temp.length - 100 > 0) {
				temp.splice(0, temp.length - 100)
			}
			return temp
		})
	}

	useMemo(() => {
		const link = localStorage.getItem('origin').replace('http', 'ws')
		const ws = new WebSocket(`${link}/api/ws/monitor`)

		ws.onmessage = (evt) => {
			const json = JSON.parse(evt.data)
			if (json.error !== null) {
				onFetchError(json.error)
				return
			}

			updateEventsList(json.data.Events)
		}
	}, [])

	return (
		<>
			<Header />
			<div className="main-page">
				<div className="wrapper">
					<div className="block today-block">
						<div className="block__content">
							<div className="circle-bar enter-count-circle-bar">
								<div className="circle-bar__descr">Вход</div>
								<div className="circle-bar__body"></div>
							</div>
							<div className="circle-bar exit-count-circle-bar">
								<div className="circle-bar__descr">Выход</div>
								<div className="circle-bar__body"></div>
							</div>
							<div className="circle-bar in-count-circle-bar">
								<div className="circle-bar__descr">Внутри</div>
								<div className="circle-bar__body"></div>
							</div>
						</div>
					</div>
					<div className="block anomalies-block">
						<div className="block__content">
							<Chart
								chartType="PieChart"
								data={[
									["Activity", "Кол-во"],
									["Вошли", 11],
									["Вышли", 10],
								]}
								options={{
									title: "Аномалии",
									backgroundColor: 'transparent',
									titleTextStyle: {
										color: 'gray',
										fontSize: 20,
										bold: false
									}
								}}
								width={"100%"}
								height={"300px"}
							/>
						</div>
					</div>
				</div>

				<div className="block events-block">
					<div className="block__header">События</div>
					<div className="block__content">
						<table className="events-table">
							<thead>
								<tr>
									<th>Время</th>
									<th>ФИО</th>
									<th>Действие</th>
								</tr>
							</thead>
							<tbody>
								{[...eventsList].reverse().map(e => {
									return (
										<tr key={e.EventId}>
											<td>{moment(e.EventDate).format('H:mm:ss')}</td>
											<td>{e.LastName} {e.FirstName} {e.MiddleName}</td>
											<td className={e.PassMode === 1 ? 'come' : 'leave'}>{e.PassMode === 1 ? 'Вошёл' : 'Вышел'}</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}

export default MainPage;