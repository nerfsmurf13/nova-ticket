<template>
	<div class="ui secondary pointing menu">
		<div class="ui container">
			<router-link to="/" class="item">
				<i class="bullhorn icon"></i> Submit a Ticket
			</router-link>
			<!-- <router-link to="/mytickets" class="item">
				<i class="ticket alternate icon"></i> Your Tickets
			</router-link> -->
			<router-link to="/alltickets" class="item">
				<i class="database icon"></i> All Tickets
			</router-link>
			<!-- <router-link to="/inventory" class="item">
				<i class="database icon"></i> Inventory
			</router-link> -->
			<router-link to="/devices" class="item">
				<i class="database icon"></i> Devices
			</router-link>
			<!-- <router-link to="/students" class="item">
				<i class="database icon"></i> Students
			</router-link> -->
			<router-link to="/containers" class="item">
				<i class="database icon"></i> Containers
			</router-link>
			<!-- <router-link to="/rooms" class="item">
				<i class="database icon"></i> Rooms
			</router-link> -->
			<div class="right menu">
				<li v-if="isLoggedIn" class="item">{{ currentUser }}</li>
				<router-link v-if="!isLoggedIn" to="/login" class="item">
					<i class="grid layout icon"></i> Login
				</router-link>
				<a v-if="isLoggedIn" v-on:click="logout" class="ui item">Logout</a>
			</div>
		</div>
	</div>
</template>

<script>
import firebase from 'firebase';
export default {
	data() {
		return {
			isLoggedIn: false,
			currentUser: false,
		};
	},
	created() {
		if (firebase.auth().currentUser) {
			this.isLoggedIn = true;
			this.currentUser = firebase.auth().currentUser.email;
		}
		// this.$root.$emit('eventing', data);
	},
	methods: {
		logout: function () {
			firebase
				.auth()
				.signOut()
				.then(() => {
					this.$router.go({ path: this.$router.path });
				});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
	font-weight: normal;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>
