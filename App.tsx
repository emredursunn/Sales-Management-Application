import { Provider } from 'react-redux';
import RootNavigation from './src/navigation/RootNavigation';
import { store } from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
    <RootNavigation />
    </Provider>
  );
}


