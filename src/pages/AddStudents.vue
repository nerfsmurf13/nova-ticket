<template>
	<div>
		<div>
			<h1>Add Container</h1>
			<p>
				<a href="#"
					>Add Student, Staff, Room, or other "container" to put inventory
					in.</a
				>
			</p>
		</div>
		<div class="four ui buttons">
			<button class="ui attached button">Add Student</button>
			<button class="attached ui button">Add Staff</button>
			<button class="attached ui button">Add Room</button>
			<button class="attached ui button">Add Virtual Container</button>
		</div>

		<form v-on:submit.prevent class="ui form segment">
			<h2>Add Student</h2>
			<div class="three fields">
				<div class="field ui">
					<label>First Name</label>
					<input
						type="text"
						v-model.trim="firstName"
						@keyup="computeEmail(firstName, lastName)"
					/>
				</div>
				<div class="field ui">
					<label>Last Name</label>
					<input
						type="text"
						v-model.trim="lastName"
						@keyup="computeEmail(firstName, lastName)"
					/>
				</div>
				<div class="field ui">
					<label>ID #</label>
					<input type="text" v-model.trim="studentId" />
				</div>
				<div class="field ui">
					<label>Grade</label>
					<input type="text" v-model.trim="grade" />
				</div>
				<div class="field" :class="{ error: location == '' }">
					<label>Campus</label>
					<select class="ui fluid dropdown" v-model="location">
						<option value="">Campus</option>
						<option value="000">Remote</option>
						<option value="001">Campus 1</option>
						<option value="002">Campus 2</option>
						<option value="003">Campus 3</option>
					</select>
				</div>
			</div>
			<div class="two fields">
				<div class="field">
					<label>Suggested Email</label>
					<div class="large text">{{ emailSuggestion }}</div>
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
		firstName: '',
		lastName: '',
		studentId: '',
		grade: '',
		location: '',
		submittedBy: '@NovaAcademy.org',
		passwordSuggestion: '',
		emailSuggestion: '',
	}),
	watch: {},
	firestore: {},
	created: function () {
		this.ticketId = this.generateTicketNumber();
	},
	updated: {
		// computeEmail,
	},
	methods: {
		generateTicketNumber: function () {
			let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZ';
			let nums = '0123456789';
			let string_length = 3;
			let number_length = 3;
			let randomstring = '';
			let randomnumber = '';
			for (let i = 0; i < string_length; i++) {
				let rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum, rnum + 1);
			}
			for (let i = 0; i < number_length; i++) {
				let r = Math.floor(Math.random() * nums.length);
				randomnumber += nums.substring(r, r + 1);
			}
			return randomstring + randomnumber;
		},
		log(message) {
			console.log(message);
		},
		computeEmail(x, y) {
			let longLastName = y;
			let longLastNameArr = longLastName.split(' ');
			let lastNameLength = longLastNameArr.length - 1;
			let shortLastName = longLastNameArr[lastNameLength];
			this.uid = x.toLowerCase() + '.' + shortLastName.toLowerCase();
			this.emailSuggestion = this.uid + '@student.novaacademy.org';
		},
		submitStudent() {
			if (
				// this.submittedBy != '@NovaAcademy.org' &&
				this.firstName != '' &&
				this.lastName != '' &&
				this.studentId != '' &&
				this.grade != '' &&
				this.location != '' &&
				this.emailSuggestion != ''
				//&&
				//this.passwordSuggestion != ''
			) {
				db.collection(`students`).doc(this.uid).set({
					assignedTo: '',
					firstName: this.firstName,
					lastName: this.lastName,
					studentId: this.studentId,
					grade: this.grade,
					lastUpdate: Date.now(),
					location: this.location,
					submittedBy: this.submittedBy,
					passwordSuggestion: this.passwordSuggestion,
					emailSuggestion: this.emailSuggestion,
					timestamp: Date.now(),
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
