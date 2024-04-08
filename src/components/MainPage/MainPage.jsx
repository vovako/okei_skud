import React, { useMemo, useState } from 'react';
import './main-page.scss'
import Header from '../Header/Header';
import Chart from 'react-google-charts';
import moment from 'moment'
import 'moment/dist/locale/ru.js';
moment.locale('ru')

function MainPage() {

	const [eventsList, setEventsList] = useState([])

	function updateEventsList(newData) {
		// setEventsList(prev => {
		// 	const uniqueData = newData.filter(nd => [...prev].filter(ul => ul.Id === nd.Id).length < 1)
		// 	const result = [...prev, ...uniqueData].sort((a, b) => (new Date(b.EventDate)).getTime() < (new Date(a.EventDate)).getTime())
		// 	console.log(result)
		// 	return result
		// })

		// const result = newData.sort((a, b) => ((new Date(b.EventDate)).getTime() > (new Date(a.EventDate)).getTime()).valueOf())

		setEventsList(prev => {
			const temp = [...prev]
			if (prev.length + newData.length > 50) {
				temp.splice(0, newData.length, ...newData)
			} else {
				temp.push(...newData)
			}
			return temp
		})
	}

	useMemo(() => {
		const link = localStorage.getItem('origin').replace('http', 'ws')
		const ws = new WebSocket(`${link}/api/ws/monitor`)

		ws.onmessage = (evt) => {
			const json = JSON.parse(evt.data)
			if (json.error !== null) return

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
								{eventsList.reverse().map(e => {
									return (
										<tr key={e.EventId}>
											<td>{moment(e.EventDate).format('H:mm:ss')}</td>
											<td>{e.LastName} {e.FirstName} {e.MiddleName}</td>
											<td>{e.PassMode === 1 ? 'Вошёл' : 'Вышел'}</td>
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