<template>
	<div>
		<div>
			<h1>Create New Ticket</h1>
			<p>
				<a href="#"
					>Need help filling this out? Click here! (Youtube Link Here!)</a
				>
			</p>
		</div>
		<form v-on:submit.prevent class="ui form segment">
			<div class="three fields">
				<div
					class="field ui"
					:class="{
						error: submittedBy == '' || submittedBy == '@NovaAcademy.org',
					}"
				>
					<label>Your e-Mail</label>
					<input type="text" v-model.trim="submittedBy" />
				</div>
				<div class="field" :class="{ error: issue1 == '' }">
					<label>Problem</label>
					<select class="ui fluid dropdown" v-model="issue1">
						<option value="">Select Issue</option>
						<option value="app">Application</option>
						<option value="desktop">Desktop Issue</option>
						<option value="laptop">Laptop Issue</option>
						<option value="email">Email</option>
						<option value="internet">Internet</option>

						<option value="printer">Printer</option>

						<option value="other">Other Issue</option>
					</select>
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
				<div class="field" :class="{ error: room == '' }">
					<label>Room</label>
					<input type="text" v-model.trim="room" />
				</div>
				<div class="field" :class="{ error: planningPeriod == '' }">
					<label>Planning Period</label>
					<select class="ui fluid dropdown" v-model="planningPeriod">
						<option value="">Select</option>
						<option value="none">None</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="lunch">Lunch</option>
						<option value="other">Other</option>
					</select>
				</div>
			</div>
			<div class="field" :class="{ error: ticketTitle == '' }">
				<label>Title</label>
				<input type="text" v-model.trim="ticketTitle" />
			</div>
			<div class="field" :class="{ error: ticketBody == '' }">
				<label>Issue Description</label>
				<textarea v-model="ticketBody"></textarea>
			</div>

			<button class="ui primary submit button" @click="submitTicket()">
				Submit Ticket
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
		issue1: '',
		issue2: '',
		planningPeriod: '',
		ticketTitle: '',
		ticketBody: '',
		submittedBy: '@NovaAcademy.org',
		location: '',
		room: '',
	}),
	watch: {},
	firestore: {},
	created: function () {
		this.ticketId = this.generateTicketNumber();
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
		submitTicket() {
			if (
				this.submittedBy != '@NovaAcademy.org' &&
				this.issue1 != '' &&
				this.planningPeriod != '' &&
				this.ticketBody != '' &&
				this.location != '' &&
				this.room != ''
			) {
				db.collection(`tickets`).doc(this.ticketId).set({
					assignedTo: '',
					issue1: this.issue1,
					issue2: this.issue2,
					lastUpdate: Date.now(),
					location: this.location,
					planningPeriod: this.planningPeriod,
					room: this.room,
					status: 0,
					submittedBy: this.submittedBy,
					ticketBody: this.ticketBody,
					ticketId: this.ticketId,
					ticketLog: [],
					ticketTitle: this.ticketTitle,
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
