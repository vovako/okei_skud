import { FC, ReactElement, createContext, useContext, useEffect, useState } from 'react'

interface IAuthContext {
	isAuth: boolean;
	setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
}
export const AuthContext = createContext({} as IAuthContext)

interface IAuthProvider {
	children: ReactElement
}

export const AuthProvider: FC<IAuthProvider> = ({ children }) => {
	const storageItem = localStorage.getItem('user-info')
	const [isAuth, setIsAuth] = useState(storageItem ? true : false)

	useEffect(() => {
		console.log('isAuth', isAuth)
	}, [isAuth])

	return (
		<AuthContext.Provider value={{ isAuth, setIsAuth }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const authContext = useContext(AuthContext)
	return authContext
}

export default useAuth;