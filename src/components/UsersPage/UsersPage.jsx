import React from 'react';
import Header from '../Header/Header';
import './users-page.scss'

function UsersPage() {
	return (
		<>
			<Header />
			<div className="users-page">
				<div className="block today-block">
					<div className="block__header">Сегодня</div>
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
					<div className="block__header">Аномалии</div>
					<div className="block__content">
						<div id="anomaly-chart"></div>
					</div>
				</div>
			</div>
		</>
	);
}

export default UsersPage;