<template>
	<div class="ui middle aligned center aligned grid">
		<div class="column">
			<h2 class="ui image header">
				<!-- <img src="assets/images/logo.png" class="image"> -->
				<div class="content">Log-in to your account</div>
			</h2>
			<form class="ui large form">
				<div class="ui stacked segment">
					<div class="field">
						<div class="ui left icon input">
							<i class="user icon"></i>
							<input
								type="text"
								name="email"
								placeholder="E-mail"
								v-model="email"
							/>
						</div>
					</div>
					<div class="field">
						<div class="ui left icon input">
							<i class="lock icon"></i>
							<input
								type="password"
								name="password"
								placeholder="Password"
								v-model="password"
							/>
						</div>
					</div>
					<div v-on:click="login" class="ui fluid large submit button">
						Login
					</div>
				</div>
				<div class="ui error message"></div>
			</form>
		</div>
	</div>
</template>
<script>
// import { db } from '../firebase';
import firebase from 'firebase';
export default {
	name: 'login',
	data: function () {
		return {
			email: '',
			password: '',
		};
	},
	methods: {
		login: function (e) {
			firebase
				.auth()
				.signInWithEmailAndPassword(this.email, this.password)
				.then(
					(user) => {
						alert(`Logged in as ${user.email}`);
						this.$router.go({ path: this.$router.path });
					},
					(err) => {
						alert(err.message);
					}
				);
		},
	},
};
</script>
<style scoped>
</style>