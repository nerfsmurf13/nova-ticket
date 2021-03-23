<template>
	<div>
		<div class="custom-margin-bottom">
			<h1>Devices</h1>
		</div>
		<div class="header">
			<a href="/adddevices">Add Devices</a>
		</div>
		<form v-on:submit.prevent class="ui huge form segment">
			<div class="field">
				<div class="field">
					<div class="field">
						<label>Search</label>
						<input type="text" v-model.trim="query" />
					</div>
				</div>
			</div>
		</form>
		<div class="ui hidden divider"></div>
		<div class="ui grid centered">
			<h2>All Devices - {{ filteredResults.length }}</h2>
		</div>

		<div class="ui grid centered">
			<table class="ui very basic table">
				<thead>
					<tr>
						<th>Label</th>
						<th>Make</th>
						<th>Model</th>
						<th>Serial</th>
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
					<tr v-for="element in filteredResults.slice()" :key="element.serial">
						<!-- <td>{{ device.id }}</td> -->

						<td data-label="Model">
							<a v-bind:href="'/device/' + element.serial">
								{{ element.labelname }}
							</a>
						</td>

						<td data-label="Grade">{{ element.manufacture }}</td>

						<td data-label="Model">
							{{ element.model }}
						</td>

						<td data-label="ID">
							{{ element.serial }}
						</td>

						<!-- <td data-label="Box">{{ device.box }}</td> -->
						<td data-label="Location">{{ element.location }}</td>

						<td>
							<button @click="deleteDevice(element)" :key="element.serial">
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
		devices: db.collection(`devices`).orderBy('timestamp'),
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
			return this.devices.filter((device) => {
				return (
					device.model.toLowerCase().includes(this.query.toLowerCase()) ||
					device.serial.toLowerCase().indexOf(this.query.toLowerCase()) >= 0 ||
					device.manufacture.toLowerCase().indexOf(this.query.toLowerCase()) >=
						0 ||
					device.labelname.toLowerCase().indexOf(this.query.toLowerCase()) >= 0
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
