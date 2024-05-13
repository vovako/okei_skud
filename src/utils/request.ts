export const origin = 'http://127.0.0.1:8082'
export const wsorigin = 'ws://127.0.0.1:8082'

export const request = (url: string, method = 'get', body: any = null) => {

	const options: RequestInit = {
		method,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		}
	}

	if (body) {
		options.body = JSON.stringify(body)
	}

	return new Promise((resolve, reject) => {
		fetch(origin + url, options)
			.then(resp => resp.json())
			.then(json => {
				if (json.error) {
					onFetchError(json.error)
					reject(json.error)
				} else {
					resolve(json.data)
				}
			})
	})
}

export function onFetchError(msg: string) {
	const errorModal = document.body.querySelector('#error-modal') as HTMLDialogElement
	errorModal.querySelector('.modal-dialog__text')!.textContent = msg
	errorModal.showModal()

	if (msg.trim() === 'сессия пользователя не действительна') {
		localStorage.removeItem('user-info')
		location.pathname = '/'
	}
}