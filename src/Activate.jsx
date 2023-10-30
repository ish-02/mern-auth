import React, {useState} from "react";
import {activate, resendEmail} from "./api";
import {useSearchParams} from "react-router-dom";

function Activate() {

	const [code, setCode] = useState("");
	const [params, _] = useSearchParams();

	const onChange = (evt) => {
		setCode(code + evt.target.value);
		let next = Number.parseInt(evt.target.name.split("-").pop()) + 1
		if(next < 5) {
			document.querySelector(`[name=password-${next}]`).focus();
		}
	}

	const handleSubmit = (evt) => {
		evt.preventDefault();

		activate({
			code: code,
			userId: params.get('userId')
		}).then((res) => {
			if(res && res.status === 200) {
				window.location.href = "/";
			}
		}).catch((reason) => {
			window.alert(reason.response.data.response);
		})
	}

	const handleResendEmail = () => {
		resendEmail(params.get('userId')).then((res) => {
			if(res && res.status === 200) {
				window.alert("email sent successfully!");
			}
		}).catch((reason) => {
			window.alert(reason.response.data.response);
		})
	}

	return (
		<>
			<form className={"flex flex-col items-start p-20"}>

				<span className={"pb-2 text-xl font-Poppins font-bold"}>Please enter the OTP</span>
				<span className={"pb-2 text-sm font-Poppins"}>
						The One-Time Password has been sent to your email ID
					</span>



				<div className={"flex items-center mt-6 w-full max-w-lg"}>

					{
						Array(5).fill(0).map((_, i) => {
							return <input key={i.toString()} onChange={onChange} name={"password-" + i} aria-describedby={"OTPField"} type={"text"} placeholder={"X"}
								   className={"p-3 text-center outline-0 w-[50px] mr-2 rounded-md border-[1px] font-bold border-gray-300"}
								   required maxLength={1} minLength={1} autoComplete={"otp"} />
						})
					}

				</div>

				<div className={"flex items-center mt-6 w-full max-w-xl"}>

					<button onClick={handleSubmit} type={"submit"} className={"rounded-md w-full p-3 text-sm text-center bg-blue-500 text-white font-bold font-Poppins"} >
						Continue
					</button>

				</div>


				<span className={"pb-2 mt-6 text-sm font-Poppins"}>
						Didn't receive an email  <span onClick={handleResendEmail} className={"text-blue-500 cursor-pointer underline"}>Click to resend</span>
					</span>


			</form>
		</>
	)
}


export default Activate;

