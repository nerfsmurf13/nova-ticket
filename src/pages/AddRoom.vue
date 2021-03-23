<template>
	<div>
		<div>
			<h1>Add Room</h1>
			<p>
				<a href="#"
					>Add Student, Staff, Room, or other "container" to put inventory
					in.</a
				>
			</p>
		</div>
		<form v-on:submit.prevent class="ui form segment">
			<h2>Add Room</h2>
			<div class="three fields">
				<div class="field ui">
					<label>Room Name</label>
					<input
						type="text"
						v-model.trim="name"
						@keyup="roomIdSuggestion(roomId, roomType, location)"
					/>
				</div>
				<div class="field ui">
					<label>Room ID</label>
					<input
						type="text"
						v-model.trim="roomId"
						@keyup="roomIdSuggestion(roomId, roomType, location)"
					/>
				</div>
				<div class="field" :class="{ error: location == '' }">
					<label>Room Type</label>
					<select
						@change="roomIdSuggestion(roomId, roomType, location)"
						class="ui fluid dropdown"
						v-model="roomType"
					>
						<option value="">Type</option>
						<option value="1">Classroom</option>
						<option value="2">Office</option>
						<option value="3">Storage</option>
						<option value="4">General</option>
					</select>
				</div>
				<div class="field" :class="{ error: location == '' }">
					<label>Campus</label>
					<select
						@change="roomIdSuggestion(roomId, roomType, location)"
						class="ui fluid dropdown"
						v-model="location"
					>
						<option value="">Campus</option>
						<option value="01">Campus 1</option>
						<option value="02">Campus 2</option>
						<option value="03">Campus 3</option>
					</select>
				</div>
			</div>
			<div class="two fields">
				<div class="field">
					<label>Suggested ID</label>
					<div class="large text">{{ uid }}</div>
				</div>
				<div class="field">
					<label>Suggested Password</label>
					<div class="large text">{{ passwordSuggestion }}</div>
				</div>
				<!-- <div class="field ui">
					<label>Time Submitted</label>
					<div></div>
				</div>
				<div class="field ui">
					<label>Last Update</label>
					<div></div>
				</div> -->
			</div>

			<button class="ui primary submit button" @click="submitStudent()">
				Add Student
			</button>
			<button class="ui clear button" @click="clearForm()">Clear</button>
		</form>
	</div>
</template>
<script>
// Ticket Info
// issue1 = Issue Dropdown
// issue2 = Unused
// ticketTitle = Ticket Title/Subject
// ticketBody = Ticket Info
// ticketLog = Log of work
// submittedBy = Who submitted ticket by email
// location = where is the issue
// room = room location
// timestamp = timestamp
// lastUpdate = timestamp when status changed
// ticketId = ticketId
// status = 0-open | 1-in progress | 2-closed
// assignedTo = who is this assigned to

import { db } from '../firebase';

export default {
	data: () => ({
		uid: '',
		name: '',
		roomId: '',
		roomType: '',
		location: '',
		submittedBy: '@NovaAcademy.org',
		passwordSuggestion: '',
	}),
	watch: {},
	firestore: {},
	methods: {
		log(message) {
			console.log(message);
		},
		roomIdSuggestion(x, y, z) {
			let id = x;
			let type = y;
			let campus = z;
			// let longLastNameArr = longLastName.split(' ');
			// let lastNameLength = longLastNameArr.length - 1;
			// let shortLastName = longLastNameArr[lastNameLength];
			this.uid = z + y + x;
			// this.emailSuggestion = this.uid + '@student.novaacademy.org';
		},
		submitStudent() {
			if (
				// this.submittedBy != '@NovaAcademy.org' &&
				this.uid != '' &&
				this.name != '' &&
				this.roomId != '' &&
				this.roomType != '' &&
				this.location != ''
				//&&
				//this.passwordSuggestion != ''
			) {
				db.collection(`rooms`).doc(this.uid).set({
					uid: this.uid,
					name: this.name,
					roomId: this.roomId,
					roomType: this.roomType,
					location: this.location,
					created: Date.now(),
				});
				this.$router.push('/ticketsubmit/' + this.ticketId);
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
