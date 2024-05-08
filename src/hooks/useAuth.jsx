import { useContext } from 'react'
import { AuthContext } from '../context'

const useAuth = () => {
	const [isAuth, setIsAuth] = useContext(AuthContext)

	return {
		isAuth, setIsAuth
	}
}

export default useAuth;