<template>
	<div class="card">
		<div class="content">
			<!-- <img
				class="right floated mini ui image"
				src="/images/avatar/large/elliot.jpg"
			/> -->
			<div class="header">Student: {{ studentId }}</div>
			<div class="header">Device: {{ rfId }}</div>
			<div class="header">Box: {{ boxNumber }}</div>
			<div class="meta">{{ timeConvert(timestamp) }}</div>
			<div class="description">
				<!-- Elliot requested permission to view your contact details -->
			</div>
		</div>
		<div class="extra content">
			<div class="ui two buttons">
				<div class="ui basic green button">Deployed</div>
				<div class="ui basic red button">Damaged</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'boxCard',
	data() {
		return {
			school: [],
			maxCapacity: [],
		};
	},
	props: {
		timestamp: '',
		date: '',
		boxNumber: '',
		schoolCode: '',
		rfId: '',
		studentId: '',
		found: '',
		missing: '',
		uid: '',
	},
	methods: {
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
};
</script>

<style></style>
