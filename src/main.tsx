import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import { GroupdProvider } from '@hooks/useGroups'
import { UsersdProvider } from './hooks/useUsers'
import { AuthProvider } from '@hooks/useAuth'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<GroupdProvider>
		<AuthProvider>
			<UsersdProvider>
				<App />
			</UsersdProvider>
		</AuthProvider>
	</GroupdProvider>
)