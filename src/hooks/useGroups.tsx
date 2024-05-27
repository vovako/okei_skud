import { FC, ReactElement, createContext, useContext, useEffect, useState } from "react";
import { request } from "@utils/request";
import useAuth from "./useAuth";

interface Igroup {
	Id: number,
	Name: string
}
interface IGroupContext {
	groups: Igroup[];
	setGroups: React.Dispatch<React.SetStateAction<Igroup[]>>
}
export const GroupContext = createContext({} as IGroupContext)

interface IGroupProvider {
	children: ReactElement
}
export const GroupProvider: FC<IGroupProvider> = ({ children }) => {
	const { isAuth } = useAuth()
	const [groups, setGroups] = useState<Igroup[]>([])

	useEffect(() => {
		if (!isAuth) return;

		request('/api/persons/departments')
			.then(data => setGroups(data as Igroup[]))
	}, [isAuth])

	return (
		<GroupContext.Provider value={{ groups, setGroups }}>
			{children}
		</GroupContext.Provider>
	)
}

const useGroups = () => {
	const { groups, setGroups } = useContext(GroupContext)

	return { groups, setGroups }
}

export default useGroups