export function logOut() {
	fetch(`${localStorage.getItem('origin')}/logout`, {
		method: 'post',
		credentials: 'include'
	})
		.then(res => res.json())
		.then(json => {
			if (json.error) {
				onFetchError(json.error)
			}
			location.hash = '#/login'
		})
}

export function onFetchError(msg) {
	const errorModal = document.body.querySelector('#error-modal')
	errorModal.querySelector('.modal-dialog__text').textContent = msg
	errorModal.showModal()

	if (msg.trim() === 'сессия пользователя не действительна') {
		setTimeout(() => {
			logOut()
		}, 2000)
	}
}

export function loadGroup() {
	return new Promise((resolve, reject) => {
		fetch(`${localStorage.getItem('origin')}/api/persons/departments`, {
			credentials: 'include'
		})
			.then(res => res.json())
			.then(json => {
				if (json.error) {
					onFetchError(json.error)
					reject()
				}
				resolve(json.data)
			})
	})
}