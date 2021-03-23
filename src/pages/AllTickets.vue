<template>
	<div class="custom-margin-bottom">
		<div>
			<h1>All Tickets</h1>
		</div>
		<form v-on:submit.prevent class="ui huge form segment">
			<div class="field">
				<div class="fields">
					<div class="eight wide field">
						<label>Search</label>
						<input
							type="text"
							v-on:keyup="fetchTickets"
							v-model="ticketQuery"
						/>
					</div>
					<div class="field">
						<label>Status</label>
						<select @change="fetchTickets" v-model="statusQuery">
							<option value="">All</option>
							<option value="0">Open</option>
							<option value="1">Pending</option>
							<option value="2">Resolved</option>
						</select>
					</div>
					<div class="field">
						<label>Location</label>
						<select @change="fetchTickets" v-model="campusQuery">
							<option value="">Location</option>
							<option value="000">Remote</option>
							<option value="001">Campus 1</option>
							<option value="002">Campus 2</option>
							<option value="003">Campus 3</option>
						</select>
					</div>
				</div>
			</div>
		</form>
		<div class="ui hidden divider"></div>
		<div class="ui grid centered">
			<h2>{{ filteredTickets.length }} Tickets</h2>
		</div>
		<div class="ui grid centered">
			<table class="ui basic table selectable">
				<thead>
					<tr>
						<th>ID</th>
						<th>Issue</th>
						<th>Status</th>
						<th>User</th>
						<!-- <th>Box</th> -->
						<th>Time</th>
						<th>
							<!-- <download-csv
								class="btn btn-default"
								:data="devices"
								name="filename.csv"
							>
								<button>Download CSV</button>
							</download-csv> -->
						</th>
					</tr>
				</thead>
				<tbody>
					<!-- <tr v-for="ticket in filteredTickets.slice().reverse()"> -->
					<tr v-for="ticket in filteredTickets.slice().reverse()">
						<!-- <td>{{ device.id }}</td> -->
						<td data-label="Issue">
							<a v-bind:href="'/ticket/' + ticket.ticketId">{{
								ticket.ticketId
							}}</a>
						</td>
						<td data-label="Issue">{{ ticket.ticketTitle }}</td>
						<td data-label="Status">{{ statusConverter(ticket.status) }}</td>
						<td data-label="User">{{ ticket.submittedBy }}</td>
						<!-- <td data-label="Box">{{ device.box }}</td> -->
						<td data-label="Time">{{ timeConvert(ticket.timestamp) }}</td>
						<td>
							<button @click="deleteDevice(ticket)" :key="ticket.id">
								Remove
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
import { db } from '../firebase';
// import * as admin from 'firebase-admin';

export default {
	data: () => ({
		tickets: [],
		masterTickets: [],
		// filteredTickets: [],

		// filteredTicketsBySearch: [],
		// naaman_devices: [],
		// memorial_devices: [],
		schoolCode: '',
		assetTag: '',
		entries: [],
		tipDevices: [],
		apData: [],
		students: [],
		ticketQuery: '',
		statusQuery: '',
		campusQuery: '',
		allFilteredData1: [],
		finalFilteredData: [],
	}),
	// watch: {
	// 	currentPage: 'fetchData',
	// 	currentPage: 'fetchTipData',
	// 	currentPage: 'fetchStudentData',
	// },
	firestore: {
		tickets: db.collection(`tickets`).orderBy('timestamp'),
	},
	// created: () => {
	// 	fetchTickets();
	// },
	// created: function () {
	// 	this.fetchData();
	// 	this.fetchTipData();
	// 	this.fetchStudentData();
	// 	this.fetchAPData();
	// },
	// created: function () {
	// 	this.listAllUsers();
	// },
	mounted: function () {
		this.fetchTickets();
	},
	methods: {
		fetchTickets() {
			// this.filteredTickets = this.tickets; //Initial 'all' ticket population for page load
			// this.loaded = true;
			this.masterTickets = this.tickets; //Initial 'all' ticket population that will be used for filtering
			// let allRawFilteredData1 = [];
			// let filteredDataBySearch = [];
			// let filteredDataByStatus = [];
			// let filteredDataByLocation = [];
			// if (this.ticketQuery) {
			// 	filteredDataBySearch = this.masterTickets.filter(
			// 		(obj) =>
			// 			obj.ticketTitle
			// 				.toLowerCase()
			// 				.indexOf(this.ticketQuery.toLowerCase()) >= 0 ||
			// 			obj.submittedBy
			// 				.toLowerCase()
			// 				.indexOf(this.ticketQuery.toLowerCase()) >= 0 ||
			// 			obj.ticketId
			// 				.toLowerCase()
			// 				.indexOf(this.ticketQuery.toLowerCase()) >= 0 ||
			// 			obj.ticketBody
			// 				.toLowerCase()
			// 				.indexOf(this.ticketQuery.toLowerCase()) >= 0 ||
			// 			obj.issue1.toLowerCase().indexOf(this.ticketQuery.toLowerCase()) >=
			// 				0 ||
			// 			obj.issue2.toLowerCase().indexOf(this.ticketQuery.toLowerCase()) >=
			// 				0
			// 	);
			// 	// this.filteredTickets = filteredDataBySearch;
			// 	// filteredDataBySearch.concat(allFilteredData1);

			// 	// this.loaded = true;
			// }
			// if (this.statusQuery) {
			// 	filteredDataByStatus = this.masterTickets.filter(
			// 		(obj) => obj.status == this.statusQuery
			// 	);
			// 	// this.filteredTickets = filteredDataByStatus;
			// 	// filteredDataByStatus.concat(allFilteredData1);
			// }
			// if (this.campusQuery) {
			// 	filteredDataByLocation = this.masterTickets.filter(
			// 		(obj) => obj.location == this.campusQuery
			// 	);
			// 	// this.filteredTickets = filteredDataByLocation;
			// 	// filteredDataByLocation.concat(allFilteredData1);
			// }
			// //Console logs to see the results of each query field
			// this.log('========');
			// this.log('TEXT');
			// this.log(this.ticketQuery);
			// this.log(filteredDataBySearch);
			// this.log('---');
			// this.log('Status');
			// this.log(this.statusQuery);
			// this.log(filteredDataByStatus);
			// this.log('---');
			// this.log('Location');
			// this.log(this.campusQuery);
			// this.log(filteredDataByLocation);
			// //Final Result (hopefully)
			// this.log('Final');
			// this.allFilteredData1 = allRawFilteredData1.concat(
			// 	filteredDataByLocation,
			// 	filteredDataByStatus,
			// 	filteredDataBySearch
			// );
			// this.log(this.allFilteredData1);
			// let buildArray = [];

			// let currentCount = 0;
			// for (let i = 0; i < this.allFilteredData1.length; i++) {
			// 	let currentCount = 0;
			// 	let current = this.allFilteredData1[i];
			// 	for (let j = 0; j < this.allFilteredData1.length; j++) {
			// 		// const element = array[index];
			// 		if (current == this.allFilteredData1[j]) {
			// 			currentCount++;
			// 			if (currentCount >= 3) {
			// 				this.finalFilteredData.push(current);
			// 				break;
			// 			}
			// 		}
			// 		// this.log(this.allFilteredData1[j]);
			// 	}
			// 	// const element = array[index];
			// }

			// this.log(this.finalFilteredData);
			//for each (something) is going to pass through a few checks to see if it passes. Taking a break.
			// array.forEach(element => {

			// });
			let youShallNotPass = (ticket) => {
				if (this.ticketQuery.includes(ticket)) {
					this.log('got a match');
				}
			};
			//Below just adds all, need something that checks if ticket passes all filters
			// this.log(
			// 	filteredDataBySearch.concat(
			// 		filteredDataByStatus.concat(filteredDataByLocation)
			// 	)

			// });
		},
		filterStatus() {
			// this.loaded = false;
			// let rocketId = e;
			// this.filterRocket = e;
			if (this.statusQuery) {
				this.filterRocket = rocketId;
			}
			// this.rocketQueryStringer();
		},
		log(message) {
			console.log(message);
		},
		deleteDevice: function (ticket) {
			if (confirm(`Are you sure you want to remove ${ticket.ticketTitle}?`)) {
				db.collection(`tickets`).doc(ticket.id).delete();
			}
		},
		clearForm: function () {
			(this.studentQuery = ''), (this.assetTag = '');
		},
		makeActive: function (student) {
			this.studentQuery = student.gsx$id.$t;
			// this.log(student.gsx$id.$t);
		},
		timeConvert(a) {
			// Unixtimestamp
			let unixtimestamp = a;
			// Months array
			let months_arr = [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			];
			// Convert timestamp to milliseconds
			let date = new Date(unixtimestamp);
			// Year
			let year = date.getFullYear();
			// Month
			let month = months_arr[date.getMonth()];
			// Day
			let day = date.getDate();
			// Hours
			let hours = date.getHours();
			// Minutes
			let mins = date.getMinutes();
			let minutes = '';
			if (mins < 10) {
				minutes = '0' + mins;
			} else {
				minutes = mins;
			}
			// Seconds
			let secs = date.getSeconds();
			let seconds = '';
			if (secs < 10) {
				seconds = '0' + secs;
			} else {
				seconds = secs;
			}
			// Display date time in MM-dd-yyyy h:m:s format
			// let convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
			let convdataTime = `${month} ${day}, ${year} @ ${hours}:${minutes}:${seconds}`;
			return convdataTime;
		},
		statusConverter(x) {
			switch (x) {
				case '0':
					return 'Open';
				case '1':
					return 'Pending';
				case '2':
					return 'Resolved';
				default:
					break;
			}
		},
	},
	computed: {
		filteredTickets: function () {
			return this.masterTickets.filter((ticket) => {
				return (
					ticket.ticketTitle
						.toLowerCase()
						.includes(this.ticketQuery.toLowerCase()) ||
					ticket.submittedBy
						.toLowerCase()
						.indexOf(this.ticketQuery.toLowerCase()) >= 0 ||
					ticket.ticketId
						.toLowerCase()
						.indexOf(this.ticketQuery.toLowerCase()) >= 0 ||
					ticket.ticketBody
						.toLowerCase()
						.indexOf(this.ticketQuery.toLowerCase()) >= 0 ||
					ticket.issue1.toLowerCase().indexOf(this.ticketQuery.toLowerCase()) >=
						0 ||
					ticket.issue2.toLowerCase().indexOf(this.ticketQuery.toLowerCase()) >=
						0
				);
			});
			// .filter((ticket2) => {
			// 	if (this.statusQuery) {
			// 		return ticket2.status == this.status;
			// 	} else {
			// 		return ticket2.ticketTitle == this.ticketQuery;
			// 	}
			// });
		},
	},
};
</script>
<style>
.custom-margin-top {
	margin-top: 1rem;
}
.custom-margin-bottom {
	margin-bottom: 3rem;
}
</style>
