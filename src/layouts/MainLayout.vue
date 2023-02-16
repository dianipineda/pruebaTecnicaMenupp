<template>
<q-layout view="lHh lpr lFf" >
  <!-- header -->

  <q-header bordered class="text-black" elevated>
    <q-toolbar>
      <q-toolbar-title class="title-style">
        App Test Menüpp
        <p class="subtitle-style">{{ conditionalLegendUser() }}</p>
      </q-toolbar-title>
      <q-btn color="negative" class="text-black" v-if="currentUser" @click='exitHome'>Exit</q-btn>
    </q-toolbar>
  </q-header>
  <q-page-container>
    <router-view>
      <div v-if="currentUser != null">
        <HomePage/>
      </div>
      <div v-else>
        <!-- parent listen to child -->
        <AccessApp @hasSignedIn="updateCurrentUser"/>     
      </div>
    </router-view>
  </q-page-container>
</q-layout>
</template>


<script>
import { useQuasar } from 'quasar'
import { getAuth, signOut } from "firebase/auth";
import HomePage from "../pages/HomePage"
import AccessApp from "../pages/AccessApp"
const auth = getAuth()

export default {
  components: {
    HomePage,AccessApp
  },
  setup(){
    const q = useQuasar()
    return {
      q
    }
  },

  data() {
    return {
      currentUser: auth.currentUser
    }
  },

  methods: {
    updateCurrentUser(value) {
      this.currentUser = value;
    },
    conditionalLegendUser() {
       const legend = this.currentUser ? "Hello ! " + this.currentUser.email : "Welcome to App Test Menüpp"
       return legend
    },
    exitHome() {
      signOut(auth).then(() => {
          this.currentUser = null;
          console.log("salio de la app")
                this.$q.notify({
                type: 'positive',
                message: 'you are signed out successfully !',
                textColor: "dark",
                position: "top",
                spinner: true,
                spinnerColor: "dark",
                actions: [{ icon: 'close', color: 'dark' }]
              }) 
          // Sign-out successful.
        }).catch((error) => {
          // An error happened.
          console.log("error: " + error.code, error.message)
        });      
    }
  }


}
</script>
<style lang="sass">
.title-style
  color: $dark 
  font-weight: bold
  padding-top:10px
  padding-bottom:10px
  font-family: Microsoft Yi Baiti
  font-size: xx-large
.subtitle-style
  color: $dark 
  padding-top:5px
  font-family: Monospace 
  font-size: large
</style>