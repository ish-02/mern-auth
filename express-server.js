const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const path = require("path");
const cors = require("cors");
const {getUser, createUser, activateUser} = require("./database");
const jsonWebToken = require("jsonwebtoken");
const {sendMail} = require("./smtp");

const app = express();
app.use(express.static("build"));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

// allows requests which have valid jwt token
app.use("/api", jwt({
	secret: process.env.secretKey || "helloSecret",
	algorithms: ["HS256"],
	getToken: (req) => {
		const cookies = req.headers.cookie;
		if(cookies) {
			req.sessionToken = cookies.split(";").find((c) => c.trim().startsWith("session"))?.split("=").pop().trim();
			return req.sessionToken
		}
		return null
	}
}), function (err, req, res, next) {
	if(err.name === "UnauthorizedError") {
		return res.status(401).send({
			response: "require login"
		});
	}
});

// backend routes
app.get("/api/secure", (req, res) => {
	const userId = jsonWebToken.decode(req.sessionToken);
	console.log(userId);
	getUser(userId, "_id").then((user) => {
		if(user) {
			if(!user.authenticated) {
				return res.status(403).send({
					response: "activate account", user: user._id.toString()
				});
			}

			let userData = user;
			delete userData.password; delete userData.otp;
			return res.status(200)
				.send({
					response: "Secure", user: userData
				});
		} else {
			return res.status(400).send({
				response: "user doesn't exist"
			});
		}
	})

});


app.post("/auth/register", (req, res) => {
	const payload = req.body;

	getUser(payload.emailAddress).then((user) => {
		if(user) {
			res.status(403).send({
				response: "user already exists, please log in"
			})
		} else {
			if(payload.emailAddress && payload.password && payload.password === payload.confirmPassword) {
				delete payload["confirmPassword"];

				payload.authenticated = false;
				payload.otp = Date.now() % 1e5;	// generating otp - for development only

				createUser(payload).then((user) => {

					sendMail({to: payload.emailAddress, subject: "Activate Account", text: `OTP: ${payload.otp}\nActivate at: http://localhost:5000/activate?userId=${user.insertedId.toString()}`})
						.then((err, resp, fullRes) => {
						console.log(err)
						console.log(resp)
						console.log(fullRes);

					});

					res
						.cookie('session', jsonWebToken.sign(user.insertedId.toString(), process.env.secretKey || "helloSecret", {algorithm: "HS256"}))
						.status(200)
						.send({
						response: "registered successfully", user: user.insertedId.toString()
					})
				})
			} else {
				res.status(400).send({
					response: "invalid credentials"
				});
			}
		}
	});

});


app.post("/auth/login", (req, res) => {
	const payload = req.body;

	getUser(payload.emailAddress).then((user) => {
		if(!user) {
			res.status(404).send({
				response: "user doesn't exist, please sign up"
			})
		} else {
			if(payload.password === user.password) {
				if(!user.authenticated) {
					return res.status(403).send({
						response: "activate account", user: user._id.toString()
					});
				}

				res
					.cookie('session', jsonWebToken.sign(user._id.toString(), process.env.secretKey || "helloSecret", {algorithm: "HS256"}))
					.status(200)
					.send({
						response: "registered successfully"
					})
			} else {
				res.status(400).send({
					response: "invalid credentials"
				});
			}
		}
	});

});


app.post("/auth/activate", (req, res) => {
	const payload = req.body;

	getUser(payload.userId, "_id").then((user) => {
		if(user) {
			if(user.authenticated) {
				return res.status(300).send({
					response: "user already authenticated", user: user._id.toString()
				});
			}
			if(user.otp.toString() === payload.code) {
				activateUser(user._id).then((doc) => {
					return res.status(200).send({
						response: "user activated", user: user._id.toString()
					});
				})
			} else {
				return res.status(400).send({
					response: "invalid credentials"
				});
			}
		} else {
			return res.status(404).send({
				response: "user doesn't exist, please sign up"
			})
		}
	})
});


app.get('/auth/resendEmail', (req, res) => {
	const userId = req.query.userId;
	if(userId) {
		getUser(userId, "_id").then((user) => {
			if(user) {

				// send email
				sendMail({to: user.emailAddress, subject: "Activate Account",  text: `OTP: ${user.otp}\nActivate at: http://localhost:5000/activate?userId=${userId}`}).then((err, resp, fullRes) => {
					console.log(err)
					console.log(resp)
					console.log(fullRes);
				});

				return res.status(200).send({
					response: "email sent!", user: user._id.toString()
				});

			} else {
				return res.status(400).send({
					response: "user doesn't exist"
				});
			}
		})
	} else {
		return res.status(400).send({
			response: "invalid parameters"
		});
	}
})


app.get('/api/logout', (req, res) => {
	res.status(200).cookie("session", "").send({
		response: "logged out"
	});
});



// serving react build static files
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "build", "index.html"));
});


app.listen(5000, () => {
	console.log("Listening on port 5000");
})