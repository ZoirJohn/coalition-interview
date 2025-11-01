// chart
const ctx = document.getElementById('myChart');
const CHART_COLORS = {
	red: '#E66FD2',
	white: '#fff',
	purple: '#8C6FE6'
};

const labels = [new Date('October 2023').toLocaleString(['en',], {
	year: "numeric", month: "short"
}), new Date('November 2023').toLocaleString(['en',], {
	year: "numeric", month: "short"
}), new Date('December 2023').toLocaleString(['en',], {
	year: "numeric", month: "short"
}), new Date('January 2024').toLocaleString(['en',], {
	year: "numeric", month: "short"
}), new Date('February 2024').toLocaleString(['en',], {
	year: "numeric", month: "short"
}), new Date('March 2024').toLocaleString(['en',], {
	year: "numeric", month: "short"
})];



const data = (datasets) => {
	return {
		labels: labels,
		datasets
	}
};

const config = (datapoints) => {
	return {
		type: 'line',
		data: data(datapoints),
		options: {
			responsive: true,
			layout: {
				padding: {
					top: 16,
					right: 16,
					bottom: 16,
					left: 16
				}
			},
			plugins: {
				legend: {
					display: false
				},
				title: {
					display: true,
					text: 'Blood Pressure',
					align: 'start',
					position: 'top',
					color: '#111',
					font: {
						size: 18,
						weight: 'bold',
						family: 'Manrope'
					},
					padding: {
						bottom: 24
					}

				}
			},
			interaction: {
				intersect: false,
			},
			scales: {
				x: {
					display: true,
					grid: {
						drawOnChartArea: false,
						drawTicks: true,
					},
					ticks: {
						font: {
							size: 12,
							weight: '600',
							family: 'Manrope',
							color: '#000'
						}
					}
				},
				y: {
					display: true,
					suggestedMin: 60,
					suggestedMax: 180,
					grid: {
						drawOnChartArea: true,
						drawTicks: true,
					},
					ticks: {
						font: {
							size: 12,
							weight: '600',
							family: 'Manrope',
						}
					}
				}
			}
		},
	}
};


// fetching data
let patients = []
let diagnosticList = []
let user = {}

const username = 'coalition'
const password = 'skills-test'
const myHeaders = new Headers()
myHeaders.append("Authorization", `Basic ${btoa(`${username}:${password}`)}`);

const requestOptions = {
	method: "GET",
	headers: myHeaders,
	redirect: "follow"
};

fetch("https://fedskillstest.coalitiontechnologies.workers.dev/10", requestOptions)
	.then((response) => response.json())
	.then((result) => {
		result.forEach(patient => {
			document.querySelector('.patients').innerHTML += `
		<a href="#">
		<li
			class="profile__data sidebar__profile ${patient.name === 'Jessica Taylor' ? 'active__profile' : ''}">
			<div class="profile__img"><img src=${patient.profile_picture}
					alt="profile-owner-avatar">
			</div>
			<div class="profile__info">
				<p class="profile__name name">${patient.name}</p>
				<p class="profile__title title">${patient.gender}, ${patient.age}</p>
			</div>
			<p href="#" class="menu"><img src="./img/icons/menu.svg"
					alt="menu-horizontal"></p>
		</li>
	</a>
						`
		})

		const commonProfile = result.find(patient => patient.name === 'Jessica Taylor')
		const common = commonProfile.diagnosis_history.slice(0, 6).reverse()

		document.querySelector('.user-profile>div').innerHTML = `<img src="${commonProfile.profile_picture}" style="width:200px;height:200px" alt="profile" /><h3>${commonProfile.name}</h3>`

		const birthdate = document.createElement('p')
		birthdate.textContent = commonProfile.date_of_birth.toLocaleString(['en'])
		document.querySelector('.birthdate').appendChild(birthdate)

		const gender = document.createElement('p')
		gender.textContent = commonProfile.gender
		document.querySelector('.gender').appendChild(gender)

		const contact = document.createElement('p')
		contact.textContent = commonProfile.phone_number
		document.querySelector('.contact').appendChild(contact)

		const emergency = document.createElement('p')
		emergency.textContent = commonProfile.emergency_contact
		document.querySelector('.emergency').appendChild(emergency)

		const insurance = document.createElement('p')
		insurance.textContent = commonProfile.insurance_type
		document.querySelector('.insurance').appendChild(insurance)

		const diastolic = common.map(diagnostic => diagnostic.blood_pressure.diastolic.value);
		const systolic = common.map(diagnostic => diagnostic.blood_pressure.systolic.value);

		commonProfile.diagnostic_list.forEach(list => {
			document.querySelector('.diagnosis-list__list').innerHTML += (`<div>
							<li class="problem">${list.name}</li>
							<li class="description">${list.description}</li>
							<li class="status">${list.status}</li>
						</div><div>
							<li class="problem">${list.name}</li>
							<li class="description">${list.description}</li>
							<li class="status">${list.status}</li>
						</div>`)
		})

		commonProfile.lab_results.forEach(result => {
			document.querySelector('.lab-results__list').innerHTML += `<li>
							<span>${result}</span>
							<img src="./img/icons/download.svg" alt="download">
						</li>`
		})
		new Chart(ctx, config([
			{
				data: systolic,
				borderColor: CHART_COLORS.red,
				tension: 0.5,
				pointRadius: 10,
				pointBorderColor: CHART_COLORS.white,
				pointHoverRadius: 10,
				backgroundColor: CHART_COLORS.red
			}, {
				data: diastolic,
				borderColor: CHART_COLORS.purple,
				tension: 0.5,
				pointRadius: 10,
				pointBorderColor: CHART_COLORS.white,
				pointHoverRadius: 10,
				backgroundColor: CHART_COLORS.purple
			},
		]));

	})
	.catch((error) => console.error(error));

// NEED TO HANDLE THE ERRORS AND REFACTOR WITH SEPARATION OF CONCERNS AND NEED TO IMPLEMENT THE DRY PRINCIPLE
