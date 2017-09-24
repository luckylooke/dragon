import './index.scss'
import { homePageHandler } from './pages/home.js'
import { installationPageHandler } from './pages/docs/installation.js'
import { createRouter } from 'vanilla-ui-router'
import 'bootstrap'

// Initialize the router with the dynamic DOM entry point
const router = createRouter( document.getElementById('app') );

// https://github.com/micromata/vanilla-ui-router
router

	// Start route: The server side URL without a hash
	.addRoute('', () => {
		/*
			Use navigateTo(…) to make dynamic route changes, i.e. to redirect to another route
		*/
		router.navigateTo('home');
	})

	.addRoute('home', {
		templateUrl: './pages/home.html',
		routeHandler: homePageHandler
	})

	.addRoute('docs/installation', {
		templateUrl: './pages/docs/installation.html',
		routeHandler: installationPageHandler
	})

	.otherwise(() => {
		// If no route configuration matches, the otherwise route is invoked.
		console.log('I am the otherwise route');
		router.navigateTo('404');
	});
