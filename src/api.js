import axios from "axios";

axios.defaults.withCredentials = true;

// const API = `http://localhost:5000`
const API = ""

async function register(data) {
	return axios.post(`${API}/auth/register`, data);
}


async function login(data) {
	return axios.post(`${API}/auth/login`, data);
}

async function secure() {
	return axios.get(`${API}/api/secure`);
}

async function activate(payload) {
	return axios.post(`${API}/auth/activate`, payload);
}

async function logout() {
	return axios.get(`${API}/api/logout`);
}

async function resendEmail(userId) {
	return axios.get(`${API}/auth/resendEmail?userId=${userId}`);
}

export { register, login, secure, activate, logout, resendEmail };