import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Register from "./Register";
import App from "./App";
import Login from "./Login";
import Activate from "./Activate";

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
	{
		path: "/",
		element: <App/>,
		children: [
			{
				path: "/login",
				element: <Login />
			}, {
				path: "/register",
				element: <Register/>
			}, {
				path: "/activate",
				element: <Activate />
			}
		]
	}
], {});

root.render(<RouterProvider router={router}/>);
