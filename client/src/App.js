import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ScrollToTop from './components/layout/ScrollToTop';

import Home from './pages/home/Home';
import Faqs from './pages/faqs';
import { FAQS } from './routes';

function App() {
	return (
		<Router>
			<Switch>
				<ScrollToTop>
					<Route path="/" exact component={Home} />
					<Route path={FAQS} exact component={Faqs} />
				</ScrollToTop>
			</Switch>
		</Router>
	);
}

export default App;