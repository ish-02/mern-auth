import React, {useEffect, useState} from "react";
import coverImage from "./static/img/cover-image.png";
import {Outlet} from "react-router-dom";
import {logout, secure} from "./api";

function App() {

	const [user, setUser] = useState(null);
	const [isSecure, setIsSecure] = useState(false);

	useEffect(() => {
		if(window.location.pathname === "/") {

			secure().then((res) => {
				setUser(res.data.user);
				setIsSecure(true)
			}).catch((reason) => {
				if(reason.response.status === 403) {
					window.location.href = `/activate?userId=${reason.response.data.user}`;
				} else if(reason.response.status === 401) {
					window.location.href = `/login`;
				} else {
					console.log(reason);
				}
			});
		}
	}, []);

	const handleLogout = () => {
		logout().then((res) => {
			if(res && res.status === 200) {
				setIsSecure(false);
				window.location.href = "/login";
			}
		}).catch((reason) => {
			window.alert(reason.response.data.response);
		});
	}

	return (
		<div className={"flex items-center justify-center w-full"}>

			{ isSecure ? <button onClick={handleLogout}
					 className={"bg-black px-6 py-3 text-white font-Poppins fixed top-0 right-0 m-4 rounded-md text-sm"}>Logout</button>
				: <></>
			}

			<div className={"flex items-start flex-col justify-center p-20"}>
				<span className={"font-Poppins text-2xl font-bold px-4"}>Hi, Welcome back <span className={"ml-2 text-green-400"}>{user?.name}</span></span>
				<img src={coverImage} alt={"cover-img"} className={"max-w-xl aspect-square p-4 -z-10 object-none"} />
			</div>

			<Outlet />

		</div>
	)
}

export default App;