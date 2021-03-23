<template>
	<div>
		<div>
			<h1>Add Devices</h1>
			<p>
				<a href="#"
					>Add Student, Staff, Room, or other "container" to put inventory
					in.</a
				>
			</p>
		</div>
		<form v-on:submit.prevent class="ui form segment">
			<h2>Add Devices</h2>
			<div class="three fields">
				<div class="field ui">
					<label>Label Name</label>
					<input type="text" v-model.trim="labelName" />
				</div>
				<div class="field ui">
					<label>Serial</label>
					<input type="text" v-model.trim="serial" />
				</div>
				<div class="field ui">
					<label>Manufacture</label>
					<input type="text" v-model.trim="manufacture" />
				</div>
				<div class="field ui">
					<label>Model</label>
					<input type="text" v-model.trim="model" />
				</div>
				<div class="field" :class="{ error: location == '' }">
					<label>Location</label>
					<select class="ui fluid dropdown" v-model="location">
						<option value="">Campus</option>
						<option value="000">Remote</option>
						<option value="001">Campus 1</option>
						<option value="002">Campus 2</option>
						<option value="003">Campus 3</option>
					</select>
				</div>
				<div class="field ui">
					<label>Fund</label>
					<input type="text" v-model.trim="fund" />
				</div>
			</div>

			<button class="ui primary submit button" @click="submitDevice()">
				Add Device
			</button>
			<button class="ui clear button" @click="clearForm()">Clear</button>
		</form>
	</div>
</template>
<script>
import { db } from '../firebase';

export default {
	data: () => ({
		labelName: '',
		serial: '',
		manufacture: '',
		model: '',
		location: '',
		fund: '',
	}),
	watch: {},
	firestore: {},
	methods: {
		log(message) {
			console.log(message);
		},
		submitDevice() {
			if (
				// this.submittedBy != '@NovaAcademy.org' &&
				this.labelName != '' &&
				this.serial != '' &&
				this.manufacture != '' &&
				this.model != '' &&
				this.location != '' &&
				this.fund != ''
				//&&
				//this.passwordSuggestion != ''
			) {
				db.collection(`devices`).doc(this.serial).set({
					assignedTo: '',
					labelname: this.labelName,
					serial: this.serial,
					manufacture: this.manufacture,
					model: this.model,
					location: this.location,
					fund: this.fund,
					room: '',
					student: '',
					staff: '',
					timestamp: Date.now(),
				});
				// this.$router.push('/ticketsubmit/' + this.ticketId);
				(this.labelName = ''), (this.serial = '');
			} else {
				// this.log(`Complete all red fields!`);
				alert(`Some text fields were left blank! Complete all red fields!`);
				// this.clearForm();
				// this.newFormFire = false;
			}
		},
		clearForm: function () {
			(this.issue1 = ''),
				(this.issue2 = ''),
				(this.planningPeriod = ''),
				(this.ticketTitle = ''),
				(this.ticketBody = ''),
				(this.submittedBy = '@NovaAcademy.org'),
				(this.location = ''),
				(this.room = '');
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
	computed: {},
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
