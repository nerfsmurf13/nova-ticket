<template>
	<div>
		<div class="custom-margin-bottom">
			<h1>Students</h1>
		</div>
		<div class="header">
			<a href="/addstudents">Add Student</a>
		</div>
		<form v-on:submit.prevent class="ui huge form segment">
			<div class="field">
				<div class="field">
					<div class="field">
						<label>Search</label>
						<input type="text" v-model.trim="query" />
					</div>
					<!-- <div class="field" :class="{ error: schoolCode == '' }">
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
					</div> -->
					<!-- <div>
						<div class="ui slider checkbox">
							<input type="checkbox" name="newsletter" />
							<label>Active Students</label>
						</div>
					</div> -->
				</div>
			</div>
		</form>
		<div class="ui hidden divider"></div>
		<div class="ui grid centered">
			<h2>All Students</h2>
		</div>

		<div class="ui grid centered">
			<table class="ui very basic table">
				<thead>
					<tr>
						<th>Name</th>
						<th>ID</th>
						<th>Grade</th>
						<th>Location</th>
						<!-- <th>Active</th> -->
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
					<tr
						v-for="element in filteredResults.slice()"
						:key="element.studentId"
					>
						<!-- <td>{{ device.id }}</td> -->
						<td data-label="Name">
							{{ element.lastName }}, {{ element.firstName }}
						</td>
						<td data-label="ID">{{ element.studentId }}</td>
						<td data-label="Grade">{{ element.grade }}</td>
						<!-- <td data-label="Box">{{ device.box }}</td> -->
						<td data-label="Location">{{ element.location }}</td>
						<td>
							<button @click="deleteDevice(element)" :key="element.id">
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
		schoolCode: '',
		assetTag: '',
		entries: [],
		tipDevices: [],
		apData: [],
		students: [],
		query: '',
	}),
	firestore: {
		students: db.collection(`students`).orderBy('lastName'),
	},
	created: function () {},
	methods: {
		log(message) {
			console.log(message);
		},
		deleteDevice: function (device) {
			if (confirm(`Are you sure you want to remove ${device.rfId}?`)) {
				db.collection(`tickets`).doc(device.id).delete();
			}
		},
		makeActive: function (student) {
			// this.studentQuery = student.gsx$id.$t;
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
		filteredResults: function () {
			return this.students.filter((ticket) => {
				return (
					ticket.lastName.toLowerCase().includes(this.query.toLowerCase()) ||
					ticket.firstName.toLowerCase().indexOf(this.query.toLowerCase()) >=
						0 ||
					ticket.studentId.toLowerCase().indexOf(this.query.toLowerCase()) >=
						0 ||
					ticket.grade.toLowerCase().indexOf(this.query.toLowerCase()) >= 0
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
