<template>
	<div>
		<div @click="toggleStudentFirst()">
			<h1 v-if="studentFirst">
				<span style="color:green;">Student First Deployment</span> ||
				<span style="color:red;">Device First Deployment</span>
			</h1>
			<h1 v-if="!studentFirst">
				<span style="color:green;">Device First Deployment</span> ||
				<span style="color:red;">Student First Deployment</span>
			</h1>
		</div>
		<!-- Student First Section -->
		<div v-if="studentFirst">
			<div @click="toggleHelp()" class="mp">
				<p>
					Instructions -
					<span v-if="help" style="color:red;">Hide</span>
					<span v-if="!help" style="color:green;">Show</span>
				</p>
				<p>
					Click on title to toggle between "Student First" or "Device First"
					deployment
				</p>
				<ol v-if="help" class="ui list">
					<li>Scan Student ID</li>
					<li>If ID found, you should see which box the device is stored in</li>
					<li>
						Ignore the "Found" and "Missing" buttons, I havnt wired those up
						yet!
					</li>
				</ol>
			</div>

			<div>
				<p>Scan Student ID and device box and RFID will be displayed</p>

				<form v-on:submit.prevent class="ui huge form">
					<div class="field">
						<label>Student ID</label>
						<input type="text" v-model.lazy="searchStudentId" ref="step1" />
					</div>
					<button
						class="ui huge positive button"
						@click="searchStudent(searchStudentId)"
					>
						Lookup
					</button>
				</form>
				<div class="mp" v-if="fakeQuery">
					<h3>Results for {{ fakeQuery }}</h3>

					<div class="ui centered cards" v-if="startedSearch">
						<box-card
							v-for="result in searchStudentIdResults"
							:boxNumber="result.box"
							:schoolCode="result.schoolCode"
							:rfId="result.rfId"
							:studentId="result.studentId"
							:found="result.found"
							:missing="result.missing"
							:date="result.date"
							:timestamp="result.timestamp"
							:uid="result.id"
						/>
					</div>
				</div>
			</div>
		</div>

		<div v-if="!studentFirst">
			<div @click="toggleHelp()" class="mp">
				<p>
					Instructions -
					<span v-if="help" style="color:red;">Hide</span>
					<span v-if="!help" style="color:green;">Show</span>
				</p>
				<p>
					Click on title to toggle between "Student First" or "Device First"
					deployment
				</p>
				<ol v-if="help" class="ui list">
					<li>Scan Device ID</li>
					<li>
						If Device ID found, you should see the student number that it
						belongs to and call them up for pickup! Useful if devices were
						collected by alpha and will be rolled out by alpha, as they should
						all be grouped in the same few boxes.
					</li>
					<li>
						Ignore the "Found" and "Missing" buttons, I havnt wired those up
						yet!
					</li>
				</ol>
			</div>

			<div>
				<p>Scan Device ID and box and Student ID will be displayed</p>

				<form v-on:submit.prevent class="ui huge form">
					<div class="field">
						<label>Device ID</label>
						<input type="text" v-model.lazy="searchDeviceId" ref="step1" />
					</div>
					<button
						class="ui huge positive button"
						@click="searchDevice(searchDeviceId)"
					>
						Lookup
					</button>
				</form>
				<div class="mp" v-if="fakeQuery">
					<h3>Results for {{ fakeQuery }}</h3>

					<div class="ui centered cards" v-if="startedSearch">
						<!-- CARDS HERE -->
						<div
							class="card"
							v-if="startedSearch"
							v-for="result in searchDeviceIdResults"
						>
							<div class="content">
								<!-- <img class="right floated mini ui image" src="/images/avatar/large/elliot.jpg" /> -->
								<div class="header">
									Student: {{ result.studentId }} || Device: {{ result.rfId }}
								</div>
								<div class="meta">{{ result.timestamp }}</div>
								<!-- <div class="description">Elliot requested permission to view your contact details</div> -->
							</div>
							<div class="extra content">
								<div class="ui two buttons">
									<div class="ui basic green button">Found</div>
									<div class="ui basic red button">Missing</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { db } from '../firebase';
import boxCard from '../components/boxCard';

export default {
	components: {
		boxCard,
	},
	data: () => ({
		searchMode: 'student', //'student'||'device'
		searchStudentId: '', //Form Input
		fakeQuery: '',
		searchStudentIdResults: '',
		searchDeviceId: '', //Form Input
		searchDeviceIdResults: '',
		devices: [],
		startedSearch: false,
		help: false,
		studentFirst: true,
	}),
	firestore: {
		devices: db.collection('devices'),
	},
	methods: {
		searchStudent(x) {
			this.startedSearch = true;
			this.searchStudentIdResults = this.devices.filter(s => s.studentId == x);
			// this.searchStudentIdResults.timestamp = this.searchStudentIdResults.time.toDate()
			this.fakeQuery = this.searchStudentId;
			this.searchStudentId = '';
		},
		searchDevice(x) {
			this.startedSearch = true;
			this.searchDeviceIdResults = this.devices.filter(s => s.rfId == x);
			// this.searchStudentIdResults.timestamp = this.searchStudentIdResults.time.toDate()
			this.fakeQuery = this.searchDeviceId;
			this.searchDeviceId = '';
		},
		convertDate(time) {
			if (time != '') {
				return;
			}
			return time.toDate();
		},
		toggleHelp() {
			if (!this.help) {
				this.help = true;
			} else {
				this.help = false;
			}
		},
		toggleStudentFirst() {
			if (!this.studentFirst) {
				this.studentFirst = true;
			} else {
				this.studentFirst = false;
			}
			this.fakeQuery = '';
		},
	},
};
</script>
<style>
.card-flow {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	border: 1px solid black;
	justify-content: space-around;
	width: 100%;
}
.oldcard {
	border: 1px lightgray solid;
	width: 20rem;
	margin: 1rem;
}
</style>
