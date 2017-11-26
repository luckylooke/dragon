import { createRouter } from 'vanilla-ui-router'

import { homePageHandler } from './pages/home.js'
import { quickStartPageHandler } from './pages/docs/quick-start.js'
import { overviewPageHandler } from './pages/docs/overview.js'

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

	.addRoute('docs', () => {
		router.navigateTo('docs/quick-start');
	})

	.addRoute('docs/quick-start', {
		templateUrl: './pages/docs/quick-start.html',
		routeHandler: quickStartPageHandler
	})

	.addRoute('docs/overview', {
		templateUrl: './pages/docs/overview.html',
		routeHandler: overviewPageHandler
	})

	.addRoute('404', {
		templateUrl: './pages/404.html'
	})

	.otherwise(() => {
		// If no route configuration matches, the otherwise route is invoked.
		console.log('I am the otherwise route');
		router.navigateTo('404');
	});