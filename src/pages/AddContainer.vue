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
			<div class="ui negative message" v-show="!active">
				<div class="header">Choose a container type below!</div>
			</div>
		</div>
		<div class="four ui buttons">
			<button
				class="ui attached button"
				id="student"
				@click="
					setActive($event.target.id);
					computeEmail(firstName, lastName);
				"
				:class="{ positive: active == 'student' }"
			>
				Add Student
			</button>
			<button
				class="ui attached button"
				id="staff"
				@click="
					setActive($event.target.id);
					computeEmail(firstName, lastName);
				"
				:class="{ positive: active == 'staff' }"
			>
				Add Staff
			</button>
			<button
				class="ui attached button"
				id="room"
				@click="setActive($event.target.id)"
				:class="{ positive: active == 'room' }"
			>
				Add Room
			</button>
		</div>

		<form v-if="active" v-on:submit.prevent class="ui form segment">
			<h2>Add {{ capitalize(active) }}</h2>
			<div class="three fields">
				<div class="field ui" v-show="active == 'room'">
					<label>Room Name</label>
					<input type="text" v-model.trim="name" key="room-name" />
				</div>
				<div class="field ui" v-show="active !== 'room'">
					<label>First Name</label>
					<input
						type="text"
						v-model.trim="firstName"
						@keyup="
							computeName(firstName, lastName);
							computeEmail(firstName, lastName);
						"
					/>
				</div>
				<div class="field ui" v-show="active !== 'room'">
					<label>Last Name</label>
					<input
						type="text"
						v-model.trim="lastName"
						@keyup="
							computeName(firstName, lastName);
							computeEmail(firstName, lastName);
						"
					/>
				</div>
				<div class="field ui" v-show="active !== 'room'">
					<label>ID #</label>
					<input type="text" v-model.trim="containerId" />
				</div>
				<!-- Hidden because not sure if we'll input grade information -->
				<!-- <div class="field ui" v-show="active == 'student'">
					<label>Grade</label>-
					<input type="text" v-model.trim="grade" />
				</div> -->
				<div class="field ui" v-show="active == 'room'">
					<label>Room #</label>
					<input
						type="text"
						v-model.trim="roomNumber"
						@keyup="computeRoomId()"
					/>
				</div>
				<div class="field" v-show="active == 'room'">
					<label>Room Type</label>
					<select
						class="ui fluid dropdown"
						v-model="roomType"
						@change="computeRoomId()"
					>
						<option value="">Select</option>
						<option value="00">Classroom</option>
						<option value="01">General</option>
						<option value="02">Office</option>
						<option value="03">Storage</option>
					</select>
				</div>
				<div class="field" :class="{ error: location == '' }">
					<label>Campus</label>
					<select
						class="ui fluid dropdown"
						v-model="location"
						@change="computeRoomId()"
					>
						<option value="">Campus</option>
						<option value="0">Remote</option>
						<option value="1">Campus 1</option>
						<option value="2">Campus 2</option>
						<option value="3">Campus 3</option>
					</select>
				</div>
			</div>
			<div class="two fields">
				<div class="field" v-show="active !== 'room'">
					<label>Suggested Email</label>
					<div class="large text">{{ emailSuggestion }}</div>
				</div>
				<!-- <div class="field" v-show="active !== 'room'">
					<label>Suggested Password</label>
					<div class="large text">{{ passwordSuggestion }}</div>
				</div> -->
				<div class="field">
					<label>Container ID</label>
					<div class="large text">{{ uid }}</div>
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

			<button class="ui primary submit button" @click="submitContainer()">
				Add {{ capitalize(active) }}
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
	props: ['currentUser'],
	data: () => ({
		active: '',
		uid: '',
		firstName: '',
		lastName: '',
		name: '',
		containerId: '',
		grade: '',
		location: '',
		submittedBy: '@NovaAcademy.org',
		passwordSuggestion: '',
		emailSuggestion: '',
		roomType: '',
		roomNumber: '',
	}),
	watch: {},
	firestore: {},
	created: function () {
		this.ticketId = this.generateTicketNumber();
	},
	mounted() {
		this.$root.$on('eventing', (data) => {
			console.log(data);
		});
	},
	methods: {
		submitContainer() {
			if (
				// this.submittedBy != '@NovaAcademy.org' &&
				this.name != '' &&
				this.uid != '' &&
				this.containerId != '' &&
				// this.studentId != '' &&
				// this.grade != '' &&
				this.location != ''
				// this.emailSuggestion != ''
				//&&
				//this.passwordSuggestion != ''
			) {
				db.collection(`containers`).doc(this.containerId).set({
					containerId: this.containerId,
					containerType: this.active,
					firstName: this.firstName,
					lastName: this.lastName,
					name: this.name,
					grade: this.grade,
					lastUpdate: Date.now(),
					location: this.location,
					submittedBy: this.submittedBy,
					passwordSuggestion: this.passwordSuggestion,
					emailSuggestion: this.emailSuggestion,
					timestamp: Date.now(),
					roomType: this.roomType,
					roomNumber: this.roomNumber,
				});
				// this.$router.push('/ticketsubmit/' + this.ticketId);
			} else {
				// this.log(`Complete all red fields!`);
				alert(`Some text fields were left blank! Complete all red fields!`);
				// this.clearForm();
				// this.newFormFire = false;
			}
		},
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
		computeRoomId() {
			if (this.active == 'room') {
				this.uid = this.location + this.roomType + this.roomNumber;
			}
		},
		computeEmail(x, y) {
			let longLastName = y;
			let longLastNameArr = longLastName.split(' ');
			let lastNameLength = longLastNameArr.length - 1;
			let shortLastName = longLastNameArr[lastNameLength];
			this.uid = x.toLowerCase() + '.' + shortLastName.toLowerCase();
			if (this.active == 'student') {
				this.emailSuggestion = this.uid + '@student.novaacademy.org';
			} else {
				this.emailSuggestion = this.uid + '@novaacademy.org';
			}
		},
		computeName(x, y) {
			this.name = y + ', ' + x;
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

		clearForm: function () {
			this.firstName = '';
			this.lastName = '';
			this.name = '';
			this.grade = '';
			this.roomType = '';
			this.location = '';
			this.roomNumber = '';
			this.emailSuggestion = '';
			this.containerId = '';
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
