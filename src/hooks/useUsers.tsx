import { ReactElement, createContext, useContext, useEffect, useState } from "react";
import { request } from "@utils/request";
import useAuth from "./useAuth";

export interface Iuser {
	Id: number,
	LastName: string,
	FirstName: string,
	MiddleName: string,
	DepartmentId: number
}
interface IUsersContext {
	users: Iuser[];
	addUsers: (newData: Iuser[]) => void,
	usersIsLoading: boolean;
	setUsersIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
}
export const UsersContext = createContext({} as IUsersContext)

interface IUsersProvider {
	children: ReactElement
}
export const UsersdProvider = ({ children }: IUsersProvider) => {
	const { isAuth } = useAuth()
	const [users, setUsers] = useState<Iuser[]>([])
	const [usersIsLoading, setUsersIsLoading] = useState(false)

	function addUsers(newData: Iuser[]) {
		if (newData === null) {
			newData = []
		}
		const uniqueData = newData.filter(nd => [...users].filter(ul => ul.Id === nd.Id).length < 1)
		setUsers([...users, ...uniqueData])
	}

	useEffect(() => {
		if (!isAuth) return;

		loadUsers(0, 30)

	}, [isAuth])

	return (
		<UsersContext.Provider value={{ users, addUsers, usersIsLoading, setUsersIsLoading }}>
			{children}
		</UsersContext.Provider>
	)
}

const useUsers = () => {
	const usersContext = useContext(UsersContext)
	return usersContext
}
export default useUsers

export function loadUsers(start: number, count: number, filterProps: string[] = []) {
	const { setUsersIsLoading, addUsers } = useContext(UsersContext)

	setUsersIsLoading(true)

	return new Promise((resolve, reject) => {
		request(`/api/persons/filter/${start}/${count}`, 'post', filterProps)
			.then(usersData => {
				const data = usersData ?? []
				addUsers(data as any[])
				resolve(data)
			})
			.catch(err => reject(err))
			.finally(() => {
				setUsersIsLoading(false)
			})
	})
}
export function addUser(firstname: string, surname: string, lastname: string, groupId: number) {
	const { setUsersIsLoading, addUsers } = useContext(UsersContext)

	setUsersIsLoading(true)

	return new Promise((resolve, reject) => {
		const body = {
			"FirstName": firstname,
			"LastName": surname,
			"MiddleName": lastname,
			"DepartmentId": groupId
		}
		request(`/api/persons`, 'post', body)
			.then(usersData => {
				const data = usersData ?? []
				addUsers(data as any[])
				resolve(data)
			})
			.catch(err => reject(err))
			.finally(() => {
				setUsersIsLoading(false)
			})
	})
}