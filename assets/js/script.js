//------------------------------------------------------------

const API_KEY = "tjTLlM7SviABaP9J6vTMcRkwD3o";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultModal = new bootstrap.Modal(
	document.getElementById("resultsModal")
);

//------------------------------------------------------------

document
	.getElementById("status")
	.addEventListener("click", (event) => getStatus(event));
document
	.getElementById("submit")
	.addEventListener("click", (event) => postForm(event));

//------------------------------------------------------------

function processOptions(form) {
	let optArray = [];

	for (let entry of form.entries()) {
		if (entry[0] === "options") {
			optArray.push(entry[1]);
		}
	}
	form.delete("options");

	form.append("options", optArray.join());

	return form;
}

//------------------------------------------------------------

async function postForm(event) {
	const form = processOptions(
		new FormData(document.getElementById("checksform"))
	);

	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			Authorization: API_KEY,
		},
		body: form,
	});
	const data = await response.json();

	if (response.ok) {
		displayErrors(data);
	} else {
		displayException(data);
		throw new Error(data.error);
	}
}

//------------------------------------------------------------

function displayErrors(data) {
	let heading = `JShint Results for ${data.file}`;

	if (data.total_errors === 0) {
		results = `<div class="no_errors">No errors reported!</div>`;
	} else {
		results = `<div>Total errors found: <span class="error_count">${data.total_errors}</span></div>`;
		for (let error of data.error_list) {
			results += `<div>At line <span class="line">${error.line}</span>, `;
			results += `column <span class="column>${error.col}</span></div>`;
			results += `<div class="error">${error.error}</div>`;
		}
	}
	document.getElementById("resultsModalTitle").innerText = heading;
	document.getElementById("results-content").innerHTML = results;
	resultModal.show();
}

//------------------------------------------------------------

async function getStatus(event) {
	const queryString = `${API_URL}?api_key=${API_KEY}`;

	const response = await fetch(queryString);

	const data = await response.json();

	if (response.ok) {
		displayStatus(data.expiry);
	} else {
		displayException(data);
		throw new Error(data.error);
	}
}

//------------------------------------------------------------

function displayStatus(data) {
	let heading = "API Key Status";
	let results = `<div>Your key is valid until</div>`;
	results += `<div class="key-status">${data}</div>`;

	document.getElementById("resultsModalTitle").innerText = heading;
	document.getElementById("results-content").innerHTML = results;
	resultModal.show();
}

//------------------------------------------------------------

function displayException(data) {
	let heading = `An Exception has Occurred`;

	results = `<div>The API returned status code: <strong>${data.status_code}</strong></div>`;
	results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
	results += `<div>Error text: <strong>${data.error}</strong></div>`;

	document.getElementById("resultsModalTitle").innerText = heading;
	document.getElementById("results-content").innerHTML = results;
	resultModal.show();
}
