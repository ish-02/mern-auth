import React, {useState} from "react";
import { togglePassword } from "./Register";
import {login} from "./api";

function Login() {

	const [data, setData] = useState({
		emailAddress: "",
		password: ""
	});

	const handleSubmit = (evt) => {
		evt.preventDefault();
		if(data.emailAddress && data.password) {

			login(data).then((res) => {
				if(res.status === 200) {
					window.location.href = "/";
				} else {
					window.alert(res.data.response);
				}
			}).catch((reason) => {
				if(reason.response.status === 403) {
					window.location.href = `/activate?userId=${reason.response.data.user}`;
				} else if(reason.response.status === 404) {
					window.alert(reason.response.data.response);
				} else {
					console.log(reason);
				}
			})

		}
	}


	const onChange = (evt) => {
		let payload = data;
		payload[evt.target.name] = evt.target.value;
		setData(payload);
	}

	return (
		<>
			<form className={"flex flex-col flex-1 max-w-xl items-start p-20"}>

				<span className={"pb-2 text-xl font-Poppins font-bold"}>Login</span>
				<span className={"pb-2 text-sm font-Poppins"}>
						Have an account? <a href={"/register"} className={"underline ml-2 text-blue-500"}>Signup</a>
					</span>


				<div className={"flex items-center mt-6 w-full max-w-xl"}>

					<input onChange={onChange} defaultValue={data.emailAddress} name={"emailAddress"} type={"email"} placeholder={"Email Address"} className={"p-3 px-6 w-full outline-0 rounded-md border-[1px] border-gray-300"} required />

				</div>

				<div className={"flex items-center mt-6 w-full max-w-xl"}>


					<div className={"flex items-center relative rounded-md p-3 px-6 border-[1px] w-full border-gray-300"}>

						<input onChange={onChange} aria-describedby={"passwordField"} name={"password"} type={"password"} placeholder={"Password"}
							   className={"pr-6 w-full outline-0"}
							   required autoComplete={"new-password"}
						/>
						<button type={"button"} name={"togglePassword"} onClick={togglePassword} className="material-symbols-outlined absolute right-0 mr-4">visibility_off</button>

					</div>


				</div>

				<div className={"flex items-center mt-6 w-full max-w-xl"}>

					<button onClick={handleSubmit} type={"submit"} className={"rounded-md w-full p-3 text-sm text-center bg-blue-500 text-white font-bold font-Poppins"} >
						Login
					</button>

				</div>


			</form>
		</>
	)
}

export default Login;