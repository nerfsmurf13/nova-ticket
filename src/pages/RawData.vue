<template>
  <div>
    <div class="custom-margin-bottom">
      <h1>Raw data</h1>
    </div>
    <div class="ui grid centered">
      <table class="ui very basic table collapsing">
        <thead>
          <tr>
            <th>School</th>
            <th>Device ID</th>
            <th>Student ID</th>
            <th>Box</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="device in devices.slice().reverse()">
            <!-- <td>{{ device.id }}</td> -->
            <td data-label="School">{{ device.schoolCode }}</td>
            <td data-label="Device ID">{{ device.rfId }}</td>
            <td data-label="Student ID">{{ device.studentId }}</td>
            <td data-label="Box">{{ device.box }}</td>
            <td data-label="Time">{{ timeConvert(device.timestamp) }}</td>
            <td>
              <button @click="deleteDevice(device)" :key="device.id">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <download-csv class="btn btn-default" :data="devices" name="filename.csv">
      <button>Download CSV (This is a slot)</button>
    </download-csv>
  </div>
</template>
<script>
import { db } from '../firebase';

export default {
  data: () => ({
    devices: [],
    naaman_devices: [],
    memorial_devices: [],
    schoolCode: '',
  }),
  firestore: {
    devices: db.collection(`devices`).orderBy('timestamp'),
    naaman_devices: db.collection(`naaman_devices`).orderBy('timestamp'),
    memorial_devices: db.collection(`memorial_devices`).orderBy('timestamp'),
    // .doc('naaman')
    //
  },
  methods: {
    deleteDevice: function(device) {
      if (confirm(`Are you sure you want to remove ${device.rfId}?`)) {
        db.collection(`devices`)
          .doc(device.id)
          .delete();
      }
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
