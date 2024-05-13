import { FC, ReactElement, createContext, useContext, useEffect, useState } from "react";
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
export const UsersdProvider: FC<IUsersProvider> = ({ children }) => {
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

		setUsersIsLoading(true)

		loadUsers(0, 30)
			.then(data => addUsers(data))
			.finally(() => setUsersIsLoading(false))

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

	return new Promise((resolve: (value: Iuser[]) => void, reject) => {
		request(`/api/persons/filter/${start}/${count}`, 'post', filterProps)
			.then(usersData => {
				const data = (usersData ?? []) as Iuser[]
				resolve(data)
			})
			.catch(err => reject(err))
	})
}
export function addUser(firstname: string, surname: string, lastname: string, groupId: number) {

	return new Promise((resolve: (value: Iuser[]) => void, reject) => {
		const body = {
			"FirstName": firstname,
			"LastName": surname,
			"MiddleName": lastname,
			"DepartmentId": groupId
		}
		
		request(`/api/persons`, 'post', body)
			.then(usersData => {
				const data = (usersData ?? []) as Iuser[]
				resolve(data)
			})
			.catch(err => reject(err))
	})
}