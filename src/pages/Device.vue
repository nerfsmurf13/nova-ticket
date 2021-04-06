<template>
	<div class="ui form segment">
		<div class="field">
			<div class="field">
				<label>Device Information</label>
				<!-- <input type="text" v-model="ticketData.ticketTitle" /> -->
				<div class="large text">{{ ticketTitle }}</div>
			</div>
			<div class="four fields">
				<div class="field ui">
					<label>Manufacture</label>
					<div class="large text">{{ manufacture }}</div>
				</div>
				<div class="field ui">
					<label>Model</label>
					<div class="large text">{{ model }}</div>
				</div>
				<div class="field">
					<label>Serial</label>
					<div class="large text">{{ serial }}</div>
				</div>
				<div class="field">
					<label>Label</label>
					<div class="large text">{{ labelname }}</div>
				</div>
			</div>
			<div class="four fields">
				<div class="field">
					<label>Status</label>
					<div class="large text">{{ statusConverter(status) }}</div>
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
			<div class="field ui">
				<label>Ticket Details</label>
				{{ ticketBody }}
			</div>
			<div class="ui form segment">
				<h3>Assignment</h3>
				<div class="three fields">
					<div class="field dropdown">
						<label>Current Assignment</label>
						<!-- <input v-model.trim="query" class="dropdown-input" /> -->
						<div class="large text">
							{{ room }}{{ staff }}{{ student }}{{ assignedContainer.name }}
						</div>
					</div>
				</div>
				<div class="three fields">
					<div class="field dropdown">
						<label>Assign To</label>
						<!-- <input v-model.trim="query" class="dropdown-input" /> -->
						<input
							v-if="Object.keys(selectedContainer).length === 0"
							ref="dropdowninput"
							v-model.trim="query"
							class="dropdown-input"
							type="text"
							placeholder="Find country"
						/>
						<div v-else @click="resetSelection" class="dropdown-selected">
							{{ selectedContainer.lastName }},
							{{ selectedContainer.firstName }}
						</div>
						<div v-show="query" class="dropdown-list">
							<div
								@click="selectContainer(container)"
								v-show="itemVisible(container)"
								v-for="container in containers"
								:key="container.name"
								class="dropdown-item"
							>
								{{ container.name }}
							</div>
						</div>
					</div>
					<div class="field ui">
						<label>Apply Changes</label>
						<button
							@click="
								updateLastUpdate();
								addDeviceNote();
							"
						>
							Apply
						</button>
					</div>
				</div>
			</div>
		</div>
		<form v-on:submit.prevent>
			<div class="ui fluid action input">
				<input type="text" placeholder="Search..." v-model="currentNote" />
				<button class="ui button" @click="addCustomDeviceNote()">
					Add Note
				</button>
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
						<div class="ui button negative" @click="deleteNote(deviceLog, log)">
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
		apData: [],
		assignedContainer: {},
		assignedTo: '',
		currentNote: '',
		deviceLog: [],
		devices: [],
		entries: [],
		labelname: '',
		lastUpdate: '',
		location: '',
		location: '',
		manufacture: '',
		model: '',
		planningPeriod: '',
		query: '',
		room: '',
		selectedContainer: {},
		serial: '',
		staff: '',
		status: 0,
		studentQuery: '',
		student: '',
		submittedBy: 'nouser@fake.com',
		ticketBody: '',
		ticketData: [],
		ticketId: '',
		ticketResolution: '',
		tickets: [],
		ticketsRef: [],
		ticketTitle: '',
		timestamp: [],
		tipDevices: [],
	}),
	watch: {
		// currentPage: 'addNote',
	},
	firestore: {
		device: db.collection(`devices`),
		containers: db.collection(`containers`).orderBy('name'),
		deviceNotes: db.collection(`deviceNotes`),
		// noteRef: db.collection(`notes`),
	},
	created: function () {
		this.serial = this.$route.params.id;
		this.getDevice();
	},
	mounted: function () {
		// this.ticketLog = doc.data().ticketLog;
	},

	methods: {
		resetSelection() {
			this.selectedContainer = {};
			this.$nextTick(() => this.$refs.dropdowninput.focus());
			this.$emit('on-item-reset');
		},
		itemVisible(item) {
			let currentName = item.name.toLowerCase();
			let currentInput = this.query.toLowerCase();
			return currentName.includes(currentInput);
		},
		selectContainer(theContainer) {
			this.selectedContainer = theContainer;
			this.query = '';
			this.$emit('on-item-selected', theContainer);
		},
		getDevice: function () {
			db.collection(`devices`)
				.doc(this.serial)
				.get()
				.then((doc) => {
					// this.ticketData = doc.data(); //Roundabout
					this.log(doc);
					this.manufacture = doc.data().manufacture;
					this.model = doc.data().model;
					this.serial = doc.data().serial;
					this.labelname = doc.data().labelname;
					this.fund = doc.data().fund;
					this.timestamp = doc.data().timestamp;
					this.lastUpdate = doc.data().lastUpdate;
					// this.deviceLog = doc.data().deviceLog;
					this.room = doc.data().room;
					this.staff = doc.data().staff;
					this.student = doc.data().student;
					this.assignedContainer = doc.data().assignedContainer;
					this.getNotes();
				})

				.catch((error) => {
					console.log('Error getting documents: ', error);
				});
		},
		updateLastUpdate() {
			let newTime = Date.now();
			db.collection(`devices`).doc(this.serial).update({
				lastUpdate: newTime,
				assignedContainer: this.selectedContainer,
				// assignedTo: this.assignedTo,
			});
			//Update assignedContainer, room staff or student also needs to be updated...
			this.assignedContainer = this.selectedContainer;
			this.room = this.selectedContainer.room;
			this.student = this.selectedContainer.student;
			this.staff = this.selectedContainer.staff;
			this.lastUpdate = newTime;
		},

		getNotes: function () {
			this.deviceLog = [];

			db.collection(`deviceNotes`)
				.where('serial', '==', this.serial)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						this.deviceLog.splice(9999, 1, doc.data());
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
				this.deviceLog = []; //Reactively clears note list
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
					this.deviceLog.push(noteArray[i]);
					this.log(noteArray[i].time);
				}
			}
			// this.getNotes();
		},
		addCustomDeviceNote() {
			let importNotesData = {
				serial: this.serial,
				note: this.currentNote,
				time: Date.now(),
				user: 'TESTUSER',
			};
			db.collection(`deviceNotes`).add(importNotesData);
			this.deviceLog.push(importNotesData);
			this.currentNote = '';
			this.updateLastUpdate();
		},
		//This Note will keep log of transfers
		addDeviceNote() {
			let importNotesData = {
				serial: this.serial,
				// note: this.currentNote,
				note: 'Device transferred to ' + this.assignedContainer.name,
				time: Date.now(),
				user: 'TESTUSER',
			};

			db.collection(`deviceNotes`).add(importNotesData);
			this.deviceLog.push(importNotesData);
			this.currentNote = '';
			this.updateLastUpdate();
		},
		// clearForm: function () {
		// 	(this.studentQuery = ''), (this.assetTag = '');
		// },
		// makeActive: function (student) {
		// 	this.studentQuery = student.gsx$id.$t;
		// 	// this.log(student.gsx$id.$t);
		// },
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
		statusConverter(x) {
			switch (x) {
				case '0':
					return 'Open';
				case '1':
					return 'Pending';
				case '2':
					return 'Resolved';
				default:
					break;
			}
		},
	},
	computed: {
		notesByTime() {
			return this.deviceLog.sort((a, b) => {
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

.dropdown {
	position: relative;
	width: 100%;
	max-width: 400px;
	margin: 0 auto;
}
.dropdown-input,
.dropdown-selected {
	width: 100%;
	padding: 10px 16px;
	border: 1px solid transparent;
	background: #edf2f7;
	line-height: 1.2em;
	outline: none;
	border-radius: 8px;
}
.dropdown-input:focus,
.dropdown-selected:hover {
	background: #fff;
	border-color: #e2e8f0;
}
.dropdown-input::placeholder {
	opacity: 0.7;
}
.dropdown-selected {
	font-weight: bold;
	cursor: pointer;
}
.dropdown-list {
	position: absolute;
	width: 100%;
	max-height: 500px;
	margin-top: 4px;
	overflow-y: auto;
	background: #ffffff;
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
		0 4px 6px -2px rgba(0, 0, 0, 0.05);
	border-radius: 8px;
	z-index: 999;
}
.dropdown-item {
	display: flex;
	width: 100%;
	padding: 11px 16px;
	cursor: pointer;
}
.dropdown-item:hover {
	background: #edf2f7;
}
.dropdown-item-flag {
	max-width: 24px;
	max-height: 18px;
	margin: auto 12px auto 0px;
}
</style>
