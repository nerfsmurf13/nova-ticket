<template>
	<div>
		<div>
			<h1>Ticket Submitted!</h1>
		</div>
		<div class="ui form success">
			<div class="ui success message">
				<div class="header">
					Your ticket has been submitted! Please be patient as a tech will get
					in touch with you as soon as possible!
				</div>
			</div>
		</div>
		<form v-on:submit.prevent class="ui form segment">
			<div class="field">
				<div class="field">
					<label>Ticket Title</label>
					<!-- <input type="text" v-model="ticketData.ticketTitle" /> -->
					<div>{{ ticketData.ticketTitle }}</div>
				</div>
				<div class="four fields">
					<div class="field ui">
						<label>ID</label>
						<div>{{ ticketData.ticketId }}</div>
					</div>
					<div class="field ui">
						<label>User</label>
						<div>{{ ticketData.submittedBy }}</div>
					</div>
					<div class="field">
						<label>Campus</label>
						<div>{{ ticketData.location }}</div>
					</div>
					<div class="field">
						<label>Room</label>
						<div>{{ ticketData.room }}</div>
					</div>
				</div>
				<div class="four fields">
					<div class="field ui">
						<label>Status</label>
						<div>{{ ticketData.status }}</div>
					</div>
					<div class="field">
						<label>Off Period</label>
						<div>{{ ticketData.planningPeriod }}</div>
					</div>
					<div class="field ui">
						<label>Time Submitted</label>
						<div>{{ timeConvert(ticketData.timestamp) }}</div>
					</div>
					<div class="field ui">
						<label>Last Update</label>
						<div>{{ timeConvert(ticketData.lastUpdate) }}</div>
					</div>
				</div>
			</div>

			<button class="ui submit button" @click="submitAnotherTicket()">
				Create Another Ticket
			</button>
		</form>
	</div>
</template>
<script>
// Ticket Info
// ticketTitle = Ticket Title/Subject
// ticketBody = Ticket Info
// ticketResolution = Text on how you fixed issue
// submittedBy = Who submitted ticket by email
// location = where is the issue
// room = room location
// timestamp = timestamp
// lastUpdate = timestamp when status changed
// ticketId = ticketId
// status = 0-open | 1-in progress | 2-closed

import { db } from '../firebase';

export default {
	data: () => ({
		tickets: [],
		// naaman_devices: [],
		// memorial_devices: [],
		ticketTitle: '',
		ticketBody: '',
		ticketResolution: '',
		submittedBy: 'nouser@fake.com',
		location: '',
		room: '',
		ticketId: '',
		lastUpdate: '',
		status: 0,
		entries: [],
		tipDevices: [],
		apData: [],
		students: [],
		studentQuery: '',
		ticketData: [],
		ticketsRef: [],
	}),
	watch: {
		currentPage: 'fetchData',
		currentPage: 'fetchTipData',
		currentPage: 'fetchStudentData',
	},
	firestore: {
		ticketsRef: db.collection(`tickets`),
		// naaman_devices: db.collection(`naaman_devices`).orderBy('timestamp'),
		// memorial_devices: db.collection(`memorial_devices`).orderBy('timestamp'),
		// .doc('naaman')
		//
	},
	created: function () {
		this.ticketId = this.$route.params.id;
		// this.ticketData = this.ticketsRef.where('ticketId', '==', this.ticketId);
		this.getTicket();
	},
	methods: {
		getTicket: function () {
			db.collection(`tickets`)
				.where('ticketId', '==', this.ticketId)
				.get()
				.then((querySnapshot) => {
					// this.ticketData = querySnapshot;
					querySnapshot.forEach((doc) => {
						// doc.data() is never undefined for query doc snapshots
						this.ticketData = doc.data();
						// console.log(doc.id, ' => ', doc.data());
					});
				})
				.catch((error) => {
					console.log('Error getting documents: ', error);
				});
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
		deleteDevice: function (device) {
			if (confirm(`Are you sure you want to remove ${device.rfId}?`)) {
				db.collection(`tickets`).doc(device.id).delete();
			}
		},
		submitAnotherTicket() {
			this.$router.push('/');
		},
		submitDevice() {
			if (this.schoolCode != '') {
				db.collection(`tickets`).add({
					timestamp: Date.now(),
					ticketTitle: this.ticketTitle,
					ticketBody: this.ticketBody,
					ticketResolution: '',
					submittedBy: this.submittedBy,
					location: this.location,
					room: this.room,
					ticketId: this.generateTicketNumber(),
					lastUpdate: '',
					status: 0,
				});
				this.log('Added');
				this.assetTag = '';
				this.studentQuery = '';
				// this.studentId = '';
				// this.box = '';
				this.$router.go({ path: alltickets });
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
	computed: {},
};
</script>
<style>
.custom-margin-top {
	margin-top: 1rem;
}
.custom-margin-bottom {
	margin-bottom: 2rem;
}
</style>
