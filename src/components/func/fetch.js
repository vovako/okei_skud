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
		})
}

export function onFetchError(msg) {
	const errorModal = document.body.querySelector('#error-modal')
	errorModal.querySelector('.modal-dialog__text').textContent = msg
	errorModal.showModal()

	if (msg.trim() === 'сессия пользователя не действительна') {
		localStorage.removeItem('user-info')
		location.pathname = '/'
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