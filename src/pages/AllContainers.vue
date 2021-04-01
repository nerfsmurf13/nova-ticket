<template>
	<div>
		<div class="custom-margin-bottom">
			<h1>All Containers ({{ capitalize(active) }})</h1>
		</div>
		<div class="header">
			<a href="/addcontainer">Add Container</a>
		</div>
		<div class="four ui buttons">
			<button
				class="ui attached button"
				id="student"
				@click="setActive($event.target.id)"
				:class="{ positive: active == 'student' }"
			>
				Students
			</button>
			<button
				class="ui attached button"
				id="staff"
				@click="setActive($event.target.id)"
				:class="{ positive: active == 'staff' }"
			>
				Staff
			</button>
			<button
				class="ui attached button"
				id="room"
				@click="setActive($event.target.id)"
				:class="{ positive: active == 'room' }"
			>
				Rooms
			</button>
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
						:key="element.containerId"
					>
						<!-- <td>{{ device.id }}</td> -->
						<td data-label="Name">
							{{ element.lastName }}, {{ element.firstName }}
						</td>
						<td data-label="ID">{{ element.containerId }}</td>
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
		active: 'student',
		devices: [],
		schoolCode: '',
		assetTag: '',
		entries: [],
		tipDevices: [],
		apData: [],
		containers: [],
		query: '',
	}),
	firestore: {
		containers: db.collection(`containers`).orderBy('name'),
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

		capitalize(x) {
			let first = x[0].toUpperCase();
			let body = x.split('');
			body.shift();
			return first + body.join('');
		},
		setActive(x) {
			// this.log(x);
			this.active = x;
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
			return this.containers.filter((el) => {
				return (
					el.containerType == this.active &&
					(el.name.toLowerCase().includes(this.query.toLowerCase()) ||
						el.containerId.toLowerCase().includes(this.query.toLowerCase()))
					// ||
					// el.name.toLowerCase().includes(this.query.toLowerCase()) ||
					// el.uid.toLowerCase().indexOf(this.query.toLowerCase()) >= 0
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
