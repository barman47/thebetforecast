import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ScrollToTop from './components/layout/ScrollToTop';

import Home from './pages/home/Home';
import Faqs from './pages/faqs';
import SubscriptionSuccess from './pages/subscriptionSuccess/SubscriptionSuccess';
import PageNotFound from './pages/pageNotFound/PageNotFound';

import { FAQS, SUBSCRIPTION_SUCCESS } from './routes';

function App() {
	return (
		<Router>
			<ScrollToTop>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path={FAQS} exact component={Faqs} />
					<Route path={SUBSCRIPTION_SUCCESS} exact component={SubscriptionSuccess} />
					<Route component={PageNotFound} />
				</Switch>
			</ScrollToTop>
		</Router>
	);
}

export default App;