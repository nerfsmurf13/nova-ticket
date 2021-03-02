<template>
	<div class="ui form segment">
		<div class="field">
			<div class="field">
				<label>Ticket Title</label>
				<!-- <input type="text" v-model="ticketData.ticketTitle" /> -->
				<div class="large text">{{ ticketTitle }}</div>
			</div>
			<div class="four fields">
				<div class="field ui">
					<label>ID</label>
					<div class="large text">{{ ticketId }}</div>
				</div>
				<div class="field ui">
					<label>User</label>
					<div class="">{{ submittedBy }}</div>
				</div>
				<div class="field">
					<label>Campus</label>
					<div class="large text">{{ location }}</div>
				</div>
				<div class="field">
					<label>Room</label>
					<div class="large text">{{ room }}</div>
				</div>
			</div>
			<div class="four fields">
				<div class="field">
					<label>Status</label>
					<div class="large text">{{ status }}</div>
				</div>
				<div class="field">
					<label>Off Period</label>
					<div class="large text">{{ planningPeriod }}</div>
				</div>
				<div class="field ui">
					<label>Time Submitted</label>
					<div>{{ timeConvert(timestamp, 1) }}</div>
				</div>
				<div class="field ui">
					<label>Last Update</label>
					<div>{{ timeConvert(lastUpdate, 1) }}</div>
				</div>
			</div>
			<div class="ui form segment">
				<h3>Controls</h3>
				<div class="four fields">
					<div class="field">
						<label>Status</label>
						<select class="ui dropdown" v-model="status">
							<option value="0">Open</option>
							<option value="1">Pending</option>
							<option value="2">Resolved</option>
						</select>
					</div>
					<div class="field">
						<label>Assigned</label>
						<select class="ui dropdown" v-model="status">
							<option value="0">Tech 1</option>
							<option value="1">Tech 2</option>
							<option value="2">Tech 3</option>
						</select>
					</div>
					<div class="field ui">
						<label>Last Update</label>
						<div>{{ timeConvert(lastUpdate, 1) }}</div>
					</div>
					<div class="field ui">
						<label>Last Update</label>
						<button @click="updateLastUpdate()">Apply</button>
					</div>
				</div>
			</div>
		</div>
		<form v-on:submit.prevent>
			<div class="ui fluid action input">
				<input type="text" placeholder="Search..." v-model="currentNote" />
				<button class="ui button" @click="addNote()">Add Note</button>
			</div>
		</form>
		<table class="ui basic table celled selectable">
			<thead>
				<tr>
					<th class="five wide center aligned">Time</th>
					<th class="seven wide center aligned">Note</th>
					<th class="three wide center aligned">User</th>
					<th class="one wide center aligned">Delete</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="log in notesByTime" :key="log.time">
					<td data-label="Time">{{ timeConvert(log.time, 1) }}</td>
					<td data-label="Note">{{ log.note }}</td>
					<td data-label="User">{{ log.user }}</td>
					<td class="center aligned">
						<!-- <button>^</button><button>v</button> -->
						<div class="ui button negative" @click="deleteNote(ticketLog, log)">
							X
						</div>
						<!-- <button @click="deleteNote(log)" :key="ticket.id">Remove</button> -->
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script>
import { db } from '../firebase';
// import firebase from 'firebase/app';

export default {
	data: () => ({
		tickets: [],
		ticketTitle: '',
		ticketBody: '',
		ticketResolution: '',
		submittedBy: 'nouser@fake.com',
		location: '',
		room: '',
		ticketId: '',
		assignedTo: '',
		lastUpdate: '',
		status: 0,
		entries: [],
		tipDevices: [],
		apData: [],
		students: [],
		studentQuery: '',
		planningPeriod: '',
		ticketLog: [],
		timestamp: [],
		ticketData: [],
		ticketsRef: [],
		// noteRef: [],
		currentNote: '',
		query: [],
	}),
	watch: {
		// currentPage: 'addNote',
	},
	firestore: {
		ticketsRef: db.collection(`tickets`),
		noteRef: db.collection(`notes`),
	},
	created: function () {
		this.ticketId = this.$route.params.id;
		this.getTicket();
	},
	mounted: function () {
		// this.ticketLog = doc.data().ticketLog;
	},

	methods: {
		getTicket: function () {
			db.collection(`tickets`)
				.doc(this.ticketId)
				.get()
				.then((doc) => {
					// this.ticketData = doc.data(); //Roundabout
					this.log(doc);
					this.tickets = doc.data().tickets;
					this.ticketTitle = doc.data().ticketTitle;
					this.ticketBody = doc.data().ticketBody;
					this.ticketResolution = doc.data().ticketResolution;
					this.submittedBy = 'nouser@fake.com';
					this.location = doc.data().location;
					this.room = doc.data().room;
					this.ticketId = doc.data().ticketId;
					this.timestamp = doc.data().timestamp;
					this.lastUpdate = doc.data().lastUpdate;
					this.status = doc.data().status;
					this.ticketLog = doc.data().ticketLog;
					this.currentNote = doc.data().currentNote;
					this.planningPeriod = doc.data().planningPeriod;
					this.getNotes();
				})

				.catch((error) => {
					console.log('Error getting documents: ', error);
				});
		},
		updateLastUpdate() {
			let newTime = Date.now();
			db.collection(`tickets`)
				.doc(this.ticketId)
				.update({ lastUpdate: newTime });
			this.lastUpdate = newTime;
		},

		getNotes: function () {
			this.ticketLog = [];

			db.collection(`notes`)
				.where('ticketId', '==', this.ticketId)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						this.ticketLog.splice(9999, 1, doc.data());
						// this.ticketLog.push(doc.data());
					});
				})
				.catch((error) => {
					console.log('Error getting document:', error);
				});
		},
		loadNotes() {
			// this.ticketLog = this.ticketData.ticketLog;
			// this.ticketLog = this.noteRef.where('ticketId', '==', this.ticketId);
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
		submitAnotherTicket() {
			this.$router.push('/');
		},
		deleteNote(noteArray, element) {
			if (confirm(`Are you sure you want to remove "${element.note}"?`)) {
				//Two parts

				//One updates google firebase data
				this.ticketLog = []; //Reactively clears note list
				var query = db.collection('notes').where('time', '==', element.time);
				query.get().then(function (querySnapshot) {
					querySnapshot.forEach(function (doc) {
						doc.ref.delete();
					});
				});
			}

			//Two updates view
			this.log(`Element Timestamp: ${element.time}`);
			for (let i = 0; i < noteArray.length; i++) {
				if (noteArray[i].time != element.time) {
					this.ticketLog.push(noteArray[i]);
					this.log(noteArray[i].time);
				}
			}

			// // this.getNotes();
		},
		addNote() {
			let importNotesData = {
				ticketId: this.ticketId,
				note: this.currentNote,
				time: Date.now(),
				user: 'ewilliams',
			};
			db.collection(`notes`).add(importNotesData);
			this.ticketLog.push(importNotesData);
			this.currentNote = '';
			this.updateLastUpdate();
		},
		clearForm: function () {
			(this.studentQuery = ''), (this.assetTag = '');
		},
		makeActive: function (student) {
			this.studentQuery = student.gsx$id.$t;
			// this.log(student.gsx$id.$t);
		},
		timeConvert(a, time) {
			//if time == true, give time and date, else just date
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
			if (time) {
				return `${month} ${day}, ${year} @ ${hours}:${minutes}:${seconds}`;
			} else {
				return `${month} ${day}, ${year}`;
			}
		},
	},
	computed: {
		notesByTime() {
			return this.ticketLog.sort((a, b) => {
				return b.time - a.time;
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
	margin-bottom: 2rem;
}
.large.text {
	font-size: 1.5rem;
}
</style>
