import React, {useState} from "react";
import {register} from "./api";


const togglePassword = (evt) => {
	const password = document.querySelectorAll('[aria-describedby=passwordField]');
	console.log(password);
	password.forEach(p => {
		console.log(p, p.type);
		p.type = p.type === "password" ? "text" : "password";
	});

	evt.target.innerHTML = evt.target.innerHTML === "visibility" ? "visibility_off" : "visibility";
}

function Register() {

	const [data, setData] = useState({
		name: "",
		companyName: "",
		role: "",
		emailAddress: "",
		department: ""
	});



	const onChange = (evt) => {
		let payload = data;
		payload[evt.target.name] = evt.target.value;
		setData(payload);
	}

	const handleSubmit = (evt) => {
		evt.preventDefault();
		const form: HTMLFormElement = document.getElementsByTagName("form")[0];
		if(form.checkValidity()) {
			if(!(data.password !== undefined && data.password.length && data.password === data.confirmPassword)) {
				window.alert("Passwords don't match!");
				document.querySelector('[name=password]').focus();
			} else {

				register(data).then((res) => {
					if(res && res.status === 200) {
						window.location.href = `/activate?userId=${res.data.user}`;
					}
				}).catch((reason) => {
					window.alert(reason.response.data.response);
				})
			}
		}
	}

	return (
		<>
			<form className={"flex flex-col items-start p-20"}>

				<span className={"pb-2 text-xl font-Poppins font-bold"}>Sign up</span>
				<span className={"pb-2 text-sm font-Poppins"}>
						Have an account? <a href={"/login"} className={"underline ml-2 text-blue-500"}>Login</a>
					</span>


				<div className={"flex items-center mt-8 w-full max-w-xl"}>

					<input onChange={onChange} defaultValue={data.name} name={"name"} type={"text"} placeholder={"Full Name"} className={"p-3 px-6 flex-1 mr-4 outline-0 rounded-md border-[1px] border-gray-300"} required />
					<input onChange={onChange} defaultValue={data.companyName} name={"companyName"} type={"text"} placeholder={"Company Name"} className={"p-3 px-6 flex-1 outline-0 rounded-md border-[1px] border-gray-300"} required />

				</div>

				<div className={"flex items-center mt-6 w-full max-w-xl"}>

					<input onChange={onChange} defaultValue={data.emailAddress} name={"emailAddress"} type={"email"} placeholder={"Email Address"} className={"p-3 px-6 flex-1 mr-4 outline-0 rounded-md border-[1px] border-gray-300"} required />
					<input onChange={onChange} defaultValue={data.role} name={"role"} type={"text"} placeholder={"Role/Title"} className={"p-3 px-6 flex-1 outline-0 rounded-md border-[1px] border-gray-300"} required />

				</div>

				<div className={"flex items-center mt-6 w-full max-w-xl"}>


					<input onChange={onChange} defaultValue={data.department} name={"department"} type={"text"} placeholder={"Department"} className={"p-3 px-6 mr-4 flex-1 outline-0 rounded-md border-[1px] border-gray-300"} required />
					<div className={"flex items-center relative rounded-md p-3 px-6 border-[1px] flex-1 border-gray-300"}>

						<input onChange={onChange} aria-describedby={"passwordField"} name={"password"} type={"password"} placeholder={"Password"}
							   className={"pr-6 w-full outline-0"}
							   required autoComplete={"new-password"}
						/>
						<button type={"button"} name={"togglePassword"} onClick={togglePassword} className="material-symbols-outlined absolute right-0 mr-4">visibility_off</button>

					</div>


				</div>

				<div className={"flex items-center mt-6 w-full max-w-xl"}>

					<input onChange={onChange} name={"confirmPassword"} aria-describedby={"passwordField"} type={"password"} placeholder={"Confirm Password"}
						   className={"p-3 px-6 w-full outline-0 rounded-md border-[1px] border-gray-300"}
						   required autoComplete={"new-password"} />

				</div>

				<div className={"flex items-center mt-6 w-full max-w-xl"}>

					<button onClick={handleSubmit} type={"submit"} className={"rounded-md w-full p-3 text-sm text-center bg-blue-500 text-white font-bold font-Poppins"} >
						Signup
					</button>

				</div>


			</form>
		</>
	)
}

export default Register;
export  { togglePassword };