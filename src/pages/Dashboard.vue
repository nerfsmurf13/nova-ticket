<template>
<!-- add broken label/button -->
	<div>
		<div>
			<h1>Dashboard</h1>
		</div>
		<div>
			<form v-on:submit.prevent class="ui huge form segment ">
				<div class="two fields">
				<div class="field">
					<label>School</label>
					<select v-model="selectSchoolCode">
						<option value="">All</option>
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
				<div class="field">
						<label>Box #</label>
						<input type="number" v-model.lazy="boxSelector" />
					</div>
				</div>
			</form>
			<div class="grid centered">
				<div class="custom-margin-bottom">
					<div class="ui three statistics">
						<div class="ui huge statistic">
							<div class="value">
								{{ devices.length }}
							</div>
							<div class="label">
								Total Collected
							</div>
						</div>
						<div class="ui huge statistic">
							<div class="value">
								{{ countBoxes(devices).length }}
							</div>
							<div class="label">
								Total Boxes
							</div>
						</div>
						<div class="ui huge statistic">
							<div class="value">
								0
							</div>
							<div class="label">
								Total Returned
							</div>
						</div>
					</div>
				</div>
				<div class="ui grid centered ">
					<table class="ui very basic table collapsing">
						<thead>
							<tr>
								<th>School</th>
								<th>Device ID</th>
								<th>Student ID</th>
								<th>Box</th>
								<th>Time</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="device in listFilteredSchool()">
								<!-- <td>{{ device.id }}</td> -->
								<td data-label="School">{{ device.schoolCode }}</td>
								<td data-label="Device ID">{{ device.rfId }}</td>
								<td data-label="Student ID">{{ device.studentId }}</td>
								<td data-label="Box">{{ device.box }}</td>
								<td data-label="Time">{{ timeConvert(device.timestamp) }}</td>
								<td>
									<button @click="deleteDevice(device)" :key="device.id">
										Remove
									</button>
								</td>
							</tr>
						</tbody>
					</table>
					<!-- {{ listFilteredSchool() }} -->
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { db } from '../firebase';
import boxCard from '../components/boxCard';

export default {
	name: 'Dashboard',
	components: {
		'box-card': boxCard,
	},
	data: () => ({
		naaman_devices: [],
		memorial_devices: [],
		devices: [],
		schoolCode: '',
		selectSchoolCode: '',
		boxSelector:'',
		boxes: {},
	}),
	firestore: {
		devices: db.collection(`devices`).orderBy('timestamp', 'desc'),
	},
	computed: {
		// boxFiltered() {
		// 	return this.devices.filter(s => s.box == 1);
		// },
		// // listFilteredSchool() {
		// // 	return this.devices.filter(s => s.schoolCode == this.selectSchoolCode);
		// // },
	},
	methods: {
		deleteDevice: function(device) {
			if (confirm(`Are you sure you want to remove ${device.rfId}?`)) {
				db.collection(`devices`)
					.doc(device.id)
					.delete();
			}
		},
		log(message) {
			console.log(message);
		},
		listFilteredSchool() {
			if (this.selectSchoolCode){
				if (this.boxSelector)
				{
					return this.devices.filter(s => s.schoolCode == this.selectSchoolCode && s.box == this.boxSelector);
					// return this.devices.filter(s => s.box == this.boxSelector);
				}
				else{
				
				return this.devices.filter(s => s.schoolCode == this.selectSchoolCode);
				}
			}
			else {
				return this.devices;
			}
		},
		schoolFiltered(x) {
			return this.devices.filter(s => s.schoolCode == x);
		},
		countBoxes(x) {
			let boxes = [];
			for (let i = 0; i < x.length; i++) {
				this.log(x[i]);
				if (!boxes.includes(x[i].box)) {
					boxes.push(x[i].box);
				}
			}
			this.boxes = boxes;
			return boxes;
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
	// computed:{
	//   countBoxes(x) {
	//     let boxes = [0]
	//     for (let i=0; i<x.length; i++){
	//       this.log(x.box)
	//       if (!boxes.includes(x.box)){
	//         boxes.push(i.box)
	//       }
	//       return boxes
	//     }
	//   },
	// }
};
</script>
<style>
.custom-margin-top{
	margin-top:1rem;
}
.custom-margin-bottom{
	margin-bottom:3rem;
}
</style>
