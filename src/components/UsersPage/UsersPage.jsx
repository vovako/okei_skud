import React from 'react';
import Header from '../Header/Header';
import './users-page.scss'

function UsersPage() {
	return (
		<>
			<Header />
			<div className="users-page">
				<div class="block today-block">
					<div class="block__header">Сегодня</div>
					<div class="block__content">
						<div class="circle-bar enter-count-circle-bar">
							<div class="circle-bar__descr">Вход</div>
							<div class="circle-bar__body"></div>
						</div>
						<div class="circle-bar exit-count-circle-bar">
							<div class="circle-bar__descr">Выход</div>
							<div class="circle-bar__body"></div>
						</div>
						<div class="circle-bar in-count-circle-bar">
							<div class="circle-bar__descr">Внутри</div>
							<div class="circle-bar__body"></div>
						</div>
					</div>
				</div>
				<div class="block anomalies-block">
					<div class="block__header">Аномалии</div>
					<div class="block__content">
						<div id="anomaly-chart"></div>
					</div>
				</div>
			</div>
		</>
	);
}

export default UsersPage;