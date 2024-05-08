import { createContext, useContext } from "react";
import useFetch from "./useFetch";

export const GroupContext = createContext([])

export const GroupdProvider = ({ children }) => {

	const { data } = useFetch('/api/persons/departments')

	return (
		<GroupContext.Provider value={data}>
			{children}
		</GroupContext.Provider>
	)
}

const useGroups = () => {
	const groupContext = useContext(GroupContext)

	return groupContext
}

export default useGroups