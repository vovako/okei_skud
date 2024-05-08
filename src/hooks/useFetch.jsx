import { useEffect, useState } from "react"

export const origin = 'http://127.0.0.1:8082'

const useFetch = (url, method = 'get', body = null) => {
	const [data, setData] = useState(null)
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	

	const options = {
		method,
		credentials: 'include',
	}

	if (body) {
		options.body = JSON.stringify(body)
		options.headers = {
			'Content-Type': 'application/json'
		}
	}

	useEffect(() => {
		setIsLoading(true)

		fetch(origin + url, options)
			.then(resp => resp.json())
			.then(json => setData(json))
			.catch(error => setError(error))
			.finally(setIsLoading(false))
	})

	return {
		data,
		isLoading,
		error
	}
}

export default useFetch