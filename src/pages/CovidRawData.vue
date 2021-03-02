<template>
	<div>
		<div class="custom-margin-bottom">
			<h1>C19 Raw data</h1>
		</div>
		<form v-on:submit.prevent class="ui huge form segment">
			<div class="field">
				<div class="field">
					<label>Student ID</label>
					<input type="text" v-model.trim="studentQuery" ref="step1" />
				</div>
				<div class="two fields">
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
				</div>
			</div>

			<button class="ui huge primary submit button" @click="submitDevice()">
				Create Record
			</button>

			<button class="ui huge clear button" @click="clearForm()">Clear</button>
		</form>
		<div class="ui hidden divider"></div>
		<div class="ui grid centered">
			<h2>All Students</h2>
		</div>
		<div class="ui grid centered">
			<table class="ui very basic table">
				<thead>
					<tr>
						<th>School</th>
						<th>Student ID</th>
						<th>Name</th>
						<th>Grade</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="student in filterStudents">
						<td data-label="First Name">{{ student.gsx$school.$t }}</td>
						<td data-label="School">{{ student.gsx$id.$t }}</td>
						<td data-label="Student ID">{{ student.gsx$name.$t }}</td>
						<td data-label="Last Name">{{ student.gsx$gr.$t }}</td>
						<td data-label="Last Name">
							<button @click="makeActive(student)" :key="student.gsx$id.$t">
								Select
							</button>
						</td>
					</tr>
					<tr v-if="!filterStudents || filterStudents.length == 0">
						<td>Nothing Checked Out</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="ui divider"></div>
		<div class="ui hidden divider"></div>
		<div class="ui grid centered">
			<h2>TipWeb Assigned Devices</h2>
		</div>
		<div class="ui grid centered">
			<table class="ui very basic table">
				<thead>
					<tr>
						<th>Tag</th>
						<th>Student ID</th>
						<th>Name</th>
						<th>Make</th>
						<th>School</th>
						<th>Status</th>
						<th>Last Scan</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="result in filterSearch">
						<td data-label="Time">{{ result.gsx$tag.$t }}</td>
						<td data-label="School">{{ result.gsx$assignedid.$t }}</td>
						<td data-label="Student ID">{{ result.gsx$assignedname.$t }}</td>
						<td data-label="Last Name">{{ result.gsx$make.$t }}</td>
						<td data-label="First Name">{{ result.gsx$schoolcode.$t }}</td>
						<!-- <td data-label="Phone">{{ result.gsx$serial.$t }}</td> -->
						<td data-label="Time">{{ result.gsx$status.$t }}</td>
						<td data-label="Last Scan">{{ result.gsx$lastscan.$t }}</td>
						<!-- <h2>{{entry.gsx$title.$t}}</h2>
        <div class="content" v-html="entry.gsx$moretext.$t"></div>
            <img :src="entry.gsx$imageurl.$t" class="img-fluid" />-->
					</tr>
					<tr v-if="!filterSearch || filterSearch.length == 0">
						<td>Nothing Checked Out</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="ui divider"></div>
		<div class="ui hidden divider"></div>
		<div class="ui grid centered">
			<h2>AP Testing</h2>
		</div>
		<div class="ui grid centered">
			<table class="ui very basic table">
				<thead>
					<tr>
						<th>Student ID</th>

						<th>Course</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="result in filterApTest">
						<td data-label="Student ID">{{ result.gsx$id.$t }}</td>
						<td data-label="Course">{{ result.gsx$course.$t }}</td>
					</tr>
					<tr v-if="!filterSearch || filterSearch.length == 0">
						<td>No AP Testing</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="ui divider"></div>
		<div class="ui hidden divider"></div>
		<div class="ui grid centered">
			<h2>Home Devices</h2>
		</div>
		<div class="ui grid centered">
			<table class="ui very basic table">
				<thead>
					<tr>
						<th>School</th>
						<th>Device ID</th>
						<th>Student ID</th>
						<!-- <th>Box</th> -->
						<th>Time</th>
						<th>
							<download-csv
								class="btn btn-default"
								:data="devices"
								name="filename.csv"
							>
								<button>Download CSV</button>
							</download-csv>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="device in devices.slice().reverse()">
						<!-- <td>{{ device.id }}</td> -->
						<td data-label="School">{{ device.schoolCode }}</td>
						<td data-label="Device ID">{{ device.rfId }}</td>
						<td data-label="Student ID">{{ device.studentId }}</td>
						<!-- <td data-label="Box">{{ device.box }}</td> -->
						<td data-label="Time">{{ timeConvert(device.timestamp) }}</td>
						<td>
							<button @click="deleteDevice(device)" :key="device.id">
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

export default {
	data: () => ({
		devices: [],
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
	watch: {
		currentPage: 'fetchData',
		currentPage: 'fetchTipData',
		currentPage: 'fetchStudentData',
	},
	firestore: {
		devices: db.collection(`tickets`).orderBy('timestamp'),
		// naaman_devices: db.collection(`naaman_devices`).orderBy('timestamp'),
		// memorial_devices: db.collection(`memorial_devices`).orderBy('timestamp'),
		// .doc('naaman')
		//
	},
	created: function () {
		this.fetchData();
		this.fetchTipData();
		this.fetchStudentData();
		this.fetchAPData();
	},
	methods: {
		fetchData: function () {
			var xhr = new XMLHttpRequest();
			var self = this;
			xhr.open(
				'GET',
				'https://spreadsheets.google.com/feeds/list/1Hkkw_a-GtTnED3LRxRp-qsBOheY2jax1mFKa13i6xS8/1/public/values?alt=json'
			);
			xhr.onload = function () {
				self.entries = JSON.parse(xhr.responseText);
				self.entries = self.entries.feed.entry;
				console.log(self.entry);
			};
			xhr.send();
		},
		fetchTipData: function () {
			var xhr = new XMLHttpRequest();
			var self = this;
			xhr.open(
				'GET',
				'https://spreadsheets.google.com/feeds/list/1fPhXxOFRYy7vxucoDyzvUl7wKuDCawfhGJ38OAH2VZ8/1/public/values?alt=json'
			);
			xhr.onload = function () {
				self.tipDevices = JSON.parse(xhr.responseText);
				self.tipDevices = self.tipDevices.feed.entry;
				self.log(self.entry);
			};
			xhr.send();
		},
		fetchStudentData: function () {
			var xhr = new XMLHttpRequest();
			var self = this;
			xhr.open(
				'GET',
				'https://spreadsheets.google.com/feeds/list/1UTyIYLmu_jyyxSo313dqfpRQCr3Q7VPhPwuV2GW0lbo/1/public/values?alt=json'
			);
			xhr.onload = function () {
				self.students = JSON.parse(xhr.responseText);
				self.students = self.students.feed.entry;
				self.log(self.entry);
			};
			xhr.send();
		},
		fetchAPData: function () {
			var xhr = new XMLHttpRequest();
			var self = this;
			xhr.open(
				'GET',
				'https://spreadsheets.google.com/feeds/list/1_jj77Yd6STyB2ni_F77EFq3wpi3SdkBERyxQtLRLBOc/1/public/values?alt=json'
			);
			xhr.onload = function () {
				self.apData = JSON.parse(xhr.responseText);
				self.apData = self.apData.feed.entry;
				self.log(self.entry);
			};
			xhr.send();
		},
		log(message) {
			console.log(message);
		},
		deleteDevice: function (device) {
			if (confirm(`Are you sure you want to remove ${device.rfId}?`)) {
				db.collection(`tickets`).doc(device.id).delete();
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
		filterSearch() {
			if (this.studentQuery.length > 0)
				return this.tipDevices.filter((student) => {
					return (
						student.gsx$assignedid.$t
							.toLowerCase()
							.indexOf(this.studentQuery.toLowerCase()) > -1 ||
						student.gsx$assignedname.$t
							.toLowerCase()
							.indexOf(this.studentQuery.toLowerCase()) > -1
					);
				});
		},
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
