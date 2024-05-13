import moment from 'moment'
import 'moment/dist/locale/ru.js';
moment.locale('ru')
import './month-chart.scss'

interface IMonthChart {
	date: moment.Moment,
	data: any[],
	onSelectDate: any
}
export default function MonthChart({ date, data, onSelectDate }: IMonthChart) {
	const monthTitle = date.format('MMMM')
	const daysCount = +date.clone().endOf('month').format('D')
	const prevMonthDaysCount = +date.clone().startOf('month').format('d') - 1
	const curDate = moment().month() === date.month() ? moment().date() : 0

	function onSelectDay(evt: MouseEvent) {
		const target = evt.target as HTMLElement
		if (!target.classList.contains('selected')) {
			document.querySelector('.comes-grid__item.selected')!.classList.remove('selected')
			target.classList.add('selected')
			const selectedDate = moment(date)
			selectedDate.date(+target.textContent!)
			document.querySelector('.info-per-day .block__header span')!.textContent = selectedDate.format('DD.MM.YYYY')

			onSelectDate(selectedDate)
		}
	}

	return (
		<div className="comes-grid">
			<div className="comes-grid__title">{monthTitle}</div>
			<div className="comes-grid__body">
				<div className="comes-grid__item head">Пн</div>
				<div className="comes-grid__item head">Вт</div>
				<div className="comes-grid__item head">Ср</div>
				<div className="comes-grid__item head">Чт</div>
				<div className="comes-grid__item head">Пт</div>
				<div className="comes-grid__item head">Сб</div>
				<div className="comes-grid__item head">Вс</div>
				{Array.from({ length: prevMonthDaysCount }).map((_, i) => (
					<div key={i} className="comes-grid__item old"></div>
				))}
				{Array.from({ length: daysCount }).map((_, i) => {
					const matchedDay = data.filter(d => (+moment(d.Time).format('D')) === (i + 1))[0]

					const additClasses = []
					if (curDate === i + 1) additClasses.push('selected');
					if (matchedDay.Coming > 0 || matchedDay.Leaving > 0)
						additClasses.push('present');
					else if ((curDate === 0 || curDate > i + 1) && moment(matchedDay.Time).day() !== 0)
						additClasses.push('absent');


					return <div onClick={onSelectDay as any} key={i} className={`comes-grid__item ${additClasses.join(' ')}`}>{i + 1}</div>
				})}
			</div>
		</div>
	);
}