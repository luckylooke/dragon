import './app.css'
import { homeHandler } from '../pages/home.js'
import { createRouter } from 'vanilla-ui-router'

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
		routeHandler: homeHandler
	})

	.otherwise(() => {
		// If no route configuration matches, the otherwise route is invoked.
		console.log('I am the otherwise route');
		router.navigateTo('404');
	});
