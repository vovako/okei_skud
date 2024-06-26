import { useEffect } from 'react';
import './main-page.scss'
import Header from '../Header/Header';
import Chart from 'react-google-charts';
import moment from 'moment'
import 'moment/dist/locale/ru.js';
moment.locale('ru');

interface IMainPage {
	eventsList: any[],
	enterCount: number,
	exitCount: number,
	anomaliesIn: number,
	anomaliesOut: number
}

function MainPage({ eventsList, enterCount, exitCount, anomaliesIn, anomaliesOut }: IMainPage) {

	function updateComesChart(enterCount: number, exitCount: number) {
		if (location.pathname !== '/') return

		const enterBar = document.querySelector('.enter-count-circle-bar') as HTMLElement
		enterBar.style.setProperty('--progress-value', enterCount.toString())
		enterBar.style.setProperty('--max-value', (enterCount + exitCount).toString())

		const exitBar = document.querySelector('.exit-count-circle-bar') as HTMLElement
		exitBar.style.setProperty('--progress-value', exitCount.toString())
		exitBar.style.setProperty('--max-value', (enterCount + exitCount).toString())

		const innerBar = document.querySelector('.in-count-circle-bar') as HTMLElement
		innerBar.style.setProperty('--progress-value', (enterCount - exitCount).toString())
		innerBar.style.setProperty('--max-value', (enterCount + exitCount).toString())
	}

	useEffect(() => {
		updateComesChart(enterCount, exitCount)
	}, [enterCount, exitCount])

	useEffect(() => {
	}, [anomaliesIn, anomaliesOut])

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
									["Вход", anomaliesIn],
									["Выход", anomaliesOut],
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