<template>
  <div>
    <div>
      <h1>Device Collection Assistant</h1>
    </div>
    <div @click="toggleHelp()" class="mp">
      <p>
        Instructions -
        <span v-if="help" style="color:red;">(Hide)</span>
        <span v-if="!help" style="color:green;">(Show)</span>
      </p>
      <div v-if="help">
        <ol class="ui list">
          <li>Scan Student ID</li>
          <li>Scan Student Device</li>
          <li>Scan Box to finalize</li>
        </ol>
        <p>
          Note: Box Barcode Labels should have your school's code in the
          thousands place.
        </p>
        <p>
          Example: Lakeview Boxes = 5001, 5002, 5003, etc. Sachse Boxes = 10001,
          10002, 10003, etc.
        </p>
      </div>
    </div>

    <div>
      <form v-on:submit.prevent class="ui huge form segment">
        <div class="two fields">
          <div class="field" :class="{ error: schoolCode == '' }">
            <label>School</label>
            <select v-model="schoolCode">
              <option value>Pick a School</option>
              <option value="002">Garland High School</option>
              <option value="003">South Garland High School</option>
              <option value="004">North Garland High School</option>
              <option value="005">Lakeview Centennial High School</option>
              <option value="006">Memorial Pathways</option>
              <option value="009">Rowlett High School</option>
              <option value="008">Naaman High School</option>
              <option value="010">Sachse High School</option>
            </select>
          </div>
          <div class="field" :class="{ error: schoolCode == '' }">
            <label>Verify School</label>
            <select v-model="verifySchoolCode">
              <option value>Pick a School</option>
              <option value="002">Garland High School</option>
              <option value="003">South Garland High School</option>
              <option value="004">North Garland High School</option>
              <option value="005">Lakeview Centennial High School</option>
              <option value="006">Memorial Pathways</option>
              <option value="009">Rowlett High School</option>
              <option value="008">Naaman High School</option>
              <option value="010">Sachse High School</option>
            </select>
          </div>
        </div>
        <div class="three fields">
          <div class="field" :class="{ error: rfIdValid == 2 }">
            <label>RF #</label>
            <input
              v-on:keydown.enter.prevent="$refs.step2.focus()"
              type="text"
              v-model.trim="rfId"
              ref="step1"
            />
          </div>
          <div class="field" :class="{ error: studentIdValid == 2 }">
            <label>Student #</label>
            <input
              v-on:keydown.enter.prevent="$refs.step3.focus()"
              ref="step2"
              type="text"
              v-model.trim="studentId"
            />
          </div>
          <div class="field">
            <label>Box #</label>
            <input ref="step3" type="number" v-model="box" />
          </div>
        </div>

        <button class="ui huge primary submit button" @click="submitDevice()">Add</button>

        <button class="ui huge clear button" @click="clearForm()">Clear</button>
      </form>
    </div>
    <div class="ui divider mp"></div>

    <div>
      <h2>Log</h2>
      <log-item
        v-for="log in logs.slice().reverse()"
        :key="log.id"
        :message="log.message"
        :color="log.color"
      />
    </div>
    <!-- <div>
      <h2>Demo (custom firestore routes)</h2>
    </div>
    <div>
      <label for="routeSchool">School</label>
      <input type="text" v-model="routeBaby" />
      <label for="route">Box</label>
      <input type="text" v-model="boxBaby" />
      <button @click="submitDeviceBaby()">Add</button>
    </div>-->
  </div>
</template>
<script>
import { db } from '../firebase';
import { Timestamp } from '../firebase';
import logItem from '../components/logItem';

export default {
  components: {
    'log-item': logItem,
  },
  data() {
    return {
      rfId: '', //Form Input
      rfIdValid: 0, //Valid States = 0-null, 1-valid, 2-invalid
      studentId: '', //Form Input
      studentIdValid: 0, //Valid States = 0-null, 1-valid, 2-invalid
      box: '', //Form Input
      boxValid: 0, //Valid States = 0-null, 1-valid, 2-invalid
      verifySchoolCode: '',
      schoolCode: '',
      schoolCodeValid: 2,
      boxNumAdd: 0,
      schoolCodeBox: 0,
      boxes: [],
      inPossession: false,
      routeBaby: '',
      boxBaby: '',
      logs: [],
      help: false,
      newFormFire: true,
      backgroundColor: 'white',
    };
  },
  firestore: {
    devices: db.collection(`devices`),
    boxes: db.collection('boxes'),
  },
  updated() {
    this.log('Updated');
    this.isRfValid();
    this.isStudentValid();
  },
  mounted() {
    this.$refs.step1.focus();
  },
  methods: {
    submitDevice() {
      if (this.schoolCode == this.verifySchoolCode) {
        if (
          this.schoolCode != '' &&
          this.box != '' &&
          this.studentIdValid == 1 &&
          this.rfIdValid == 1
        ) {
          db.collection(`devices`).add({
            schoolCode: this.schoolCode,
            rfId: this.rfId,
            studentId: this.studentId,
            box: this.box,
            timestamp: Date.now(),
            inPossession: true,
            edit: false,
          });
          //testing
          this.logs.push({
            message: `Success! ${this.rfId} from ${this.studentId} is collected into ${this.box}!`,
            color: 'green',
          });
          this.rfId = '';
          this.studentId = '';
          this.box = '';
          this.$refs.step1.focus();
        } else {
          this.logs.push({
            message: `Fail! Please try again!`,
            color: 'red',
          });
          this.clearForm();
          // this.newFormFire = false;
        }
      } else {
        this.logs.push({
          message: `School Verification failed! Please try again!`,
          color: 'red',
        });
      }
    },
    clearForm() {
      this.rfId = '';
      this.studentId = '';
      this.box = '';
      this.rfIdValid = 0;
      this.studentIdValid = 0;
      // this.newFormFire = true;
      this.$refs.step1.focus();
    },
    isRfValid() {
      // if (this.newFormFire) {
      if (this.rfId.length >= 7 && this.rfId.length <= 9) {
        // this.newFormFire = false;
        this.rfIdValid = 1;
      } else {
        this.rfIdValid = 2;
      }
      // }
    },
    isStudentValid() {
      if (this.studentId.length == 6) {
        this.studentIdValid = 1;
      } else {
        this.studentIdValid = 2;
      }
    },
    toggleHelp() {
      if (!this.help) {
        this.help = true;
      } else {
        this.help = false;
      }
    },
    log(message) {
      console.log(message);
    },
    countBox() {
      db.collection('boxes').add({
        schoolCodeBox: this.schoolCodeBox,
        boxNumAdd: this.boxNumAdd,
        timestamp: Timestamp.now(),
        edit: false,
      });
      //testing
      this.boxNumAdd++;
    },
  },
  computed: {
    validTest() {},
  },
};
</script>
<style></style>
