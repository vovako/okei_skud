import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import { GroupProvider } from '@hooks/useGroups'
import { UsersdProvider } from './hooks/useUsers'
import { AuthProvider } from '@hooks/useAuth'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<AuthProvider>
		<GroupProvider>
			<UsersdProvider>
				<App />
			</UsersdProvider>
		</GroupProvider>
	</AuthProvider>
)