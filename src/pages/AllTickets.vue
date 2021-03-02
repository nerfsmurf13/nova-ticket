<template>
	<div>
		<div>
			<h1>All Tickets</h1>
		</div>
		<form v-on:submit.prevent class="ui huge form segment">
			<div class="field">
				<div class="three fields">
					<div class="field">
						<label>Search</label>
						<input type="text" v-model.trim="studentQuery" ref="step1" />
					</div>
					<div class="field" :class="{ error: schoolCode == '' }">
						<label>Asset Tag</label>
						<input type="text" v-model.trim="assetTag" ref="step1" />
					</div>
					<div class="field" :class="{ error: schoolCode == '' }">
						<label>School</label>
						<select v-model="schoolCode">
							<option value>Pick a School</option>
							<option value="002">Garland High School</option>
							<option value="003">South Garland High School</option>
							<option value="004">North Garland High School</option>
							<option value="005">Lakeview Centennial High School</option>
							<option value="006">Memorial Pathways</option>
							<option value="009">Rowlett High School</option>
							<option value="008">Naaman High School</option>
							<option value="010">Sachse High School</option>
						</select>
					</div>
					<div>
						<i class="x icon large"></i>
					</div>
				</div>
			</div>

			<button class="ui huge primary submit button" @click="submitDevice()">
				Create Record
			</button>
		</form>
		<div class="ui hidden divider"></div>
		<div class="ui grid centered">
			<h2>Tickets</h2>
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
					<tr v-for="ticket in tickets.slice().reverse()">
						<!-- <td>{{ device.id }}</td> -->
						<td data-label="Issue">
							<a v-bind:href="'/ticket/' + ticket.ticketId">{{
								ticket.ticketId
							}}</a>
						</td>
						<td data-label="Issue">{{ ticket.ticketTitle }}</td>
						<td data-label="Status">{{ ticket.status }}</td>
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
			<!-- <div
				aria-label="Pagination Navigation"
				role="navigation"
				class="ui pagination menu"
			>
				<a
					aria-current="false"
					aria-disabled="false"
					tabindex="0"
					value="1"
					aria-label="Previous item"
					type="prevItem"
					class="item"
					>⟨</a
				><a
					aria-current="true"
					aria-disabled="false"
					tabindex="0"
					value="1"
					type="pageItem"
					class="active item"
					>1</a
				><a
					aria-current="false"
					aria-disabled="false"
					tabindex="0"
					value="2"
					type="pageItem"
					class="item"
					>2</a
				><a
					aria-current="false"
					aria-disabled="false"
					tabindex="0"
					value="3"
					type="pageItem"
					class="item"
					>3</a
				><a
					aria-current="false"
					aria-disabled="false"
					tabindex="0"
					value="2"
					aria-label="Next item"
					type="nextItem"
					class="item"
					>⟩</a
				>
			</div> -->
		</div>
	</div>
</template>
<script>
import { db } from '../firebase';

export default {
	data: () => ({
		tickets: [],
		// naaman_devices: [],
		// memorial_devices: [],
		schoolCode: '',
		assetTag: '',
		entries: [],
		tipDevices: [],
		apData: [],
		students: [],
		studentQuery: '',
	}),
	// watch: {
	// 	currentPage: 'fetchData',
	// 	currentPage: 'fetchTipData',
	// 	currentPage: 'fetchStudentData',
	// },
	firestore: {
		tickets: db.collection(`tickets`).orderBy('timestamp'),
	},
	// created: function () {
	// 	this.fetchData();
	// 	this.fetchTipData();
	// 	this.fetchStudentData();
	// 	this.fetchAPData();
	// },
	methods: {
		log(message) {
			console.log(message);
		},
		deleteDevice: function (ticket) {
			if (confirm(`Are you sure you want to remove ${ticket.ticketTitle}?`)) {
				db.collection(`tickets`).doc(ticket.id).delete();
			}
		},
		submitDevice() {
			if (this.schoolCode != '') {
				db.collection(`tickets`).add({
					schoolCode: this.schoolCode,
					rfId: this.assetTag,
					studentId: this.studentQuery,
					timestamp: Date.now(),
				});
				this.log('Added');
				this.assetTag = '';
				this.studentQuery = '';
				// this.studentId = '';
				// this.box = '';
			} else {
				this.log(`Fail! Please try again!`);
				this.clearForm();
				// this.newFormFire = false;
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
	},
	computed: {
		// filterSearch() {
		// 	if (this.studentQuery.length > 0)
		// 		return this.tipDevices.filter((student) => {
		// 			return (
		// 				student.gsx$assignedid.$t
		// 					.toLowerCase()
		// 					.indexOf(this.studentQuery.toLowerCase()) > -1 ||
		// 				student.gsx$assignedname.$t
		// 					.toLowerCase()
		// 					.indexOf(this.studentQuery.toLowerCase()) > -1
		// 			);
		// 		});
		// },
		filterStudents() {
			if (this.studentQuery.length > 0)
				return this.students.filter((student) => {
					return (
						student.gsx$id.$t
							.toLowerCase()
							.indexOf(this.studentQuery.toLowerCase()) > -1 ||
						student.gsx$name.$t
							.toLowerCase()
							.indexOf(this.studentQuery.toLowerCase()) > -1
					);
				});
		},
		filterApTest() {
			if (this.studentQuery.length > 0)
				return this.apData.filter((test) => {
					return (
						test.gsx$id.$t
							.toLowerCase()
							.indexOf(this.studentQuery.toLowerCase()) > -1
					);
				});
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
