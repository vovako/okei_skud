import moment from 'moment'
import 'moment/dist/locale/ru.js';
moment.locale('ru')

export default function MonthChart({ date, data }) {
	const monthTitle = date.format('MMMM')
	const daysCount = +date.clone().endOf('month').format('D')
	const prevMonthDaysCount = +date.clone().startOf('month').format('d') - 1
	const curDay = moment().month() === date.month() ? moment().day() : 0

	function onSelectDay(evt) {
		if (!evt.target.classList.contains('selected')) {
			document.querySelector('.comes-grid__item.selected').classList.remove('selected')
			evt.target.classList.add('selected')
			const curDate = moment(date)
			curDate.date(+evt.target.textContent)
			document.querySelector('.info-per-day .block__header span').textContent = curDate.format('DD.MM.YYYY')
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
					if (curDay === i + 1) additClasses.push('selected');
					if (matchedDay.Coming > 0 || matchedDay.Leaving > 0)
						additClasses.push('present');
					else
						additClasses.push('absent');

					return <div onClick={onSelectDay} key={i} className={`comes-grid__item ${additClasses.join(' ')}`}>{i + 1}</div>
				})}
			</div>
		</div>
	);
}