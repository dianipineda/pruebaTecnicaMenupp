<template>
  <q-layout view="lHh lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md container-log">
        <div class="q-pa-lg">
          <!-- log in -->
          <div>
            <h5 class="text-weight-bold ">{{  access ? "Log In": "Sign Up" }}</h5>
            <!-- form -->
            <q-form @submit.prevent="processForm" @reset="onReset" class="q-gutter-md" @hasSignedOut="currentUser">
              <!-- email -->
              <div class="row">
                <div class="col-3 margin-label">
                  <label class="text-dark text-h6">Email:</label>
                </div>
                <div class="col-9">
                  <q-input filled type="email" v-model="email" label="Your e-mail *" hint="example@somewhere.com"
                     :rules="[val => val && val.length > 0 || 'Please type something']" />
                </div>
              </div>
              <!-- password -->
              <div class="row">
                <div class="col-3 margin-label">
                  <label class="text-dark text-h6">Password:</label>
                </div>
                <div class="col-9">
                  <q-input filled type="password" v-model="password" label="Your password *" lazy-rules :rules="[
                    val => al => val && val.length > 0 || 'Please type your password',
                  ]" />
                </div>
              </div>
              <!-- buttons -->
              <div class="text-dark">
                <q-btn
                class="q-mx-xs" 
                type="submit"
                color="primary"
                text-color="dark" 
                v-if="!access"
                @click="access = true">
                I've already have an account
                </q-btn>
                <q-btn
                class="q-mx-xs"
                type="submit"
                color="primary"
                text-color="dark" 
                v-else
                @click="access = false">
                I don´t have an account yet
                </q-btn>
                <q-btn
                class="q-mx-xs" 
                :label ="access ? 'Log in' : 'Sign Up'"
                type="submit"
                color="primary"
                text-color="dark" >
                </q-btn>
                <q-btn
                class="q-mx-xs"
                label="Reset"
                type="reset"
                color="warning"
                text-color="dark"
                 >
                </q-btn>
              </div>
            </q-form>
          </div>
          <!-- span -->
        </div>
        <q-page-container>
          <router-view />
        </q-page-container>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
const auth = getAuth()
export default {
  name: 'AccessApp',
  setup(){
    const q = useQuasar()
    return {
      q
    }
  },

  data() {
    return {
      currentUser: auth.currentUser,
      access : ref(true),
      email : ref('prueba@prueba.com'),
      password : ref('123123'),
    }
  },

  methods: {
    onReset() {
      this.email = null;
      this.password = null;
    },
    processForm() {
      
      if(!this.access){
        //Register
        createUserWithEmailAndPassword(auth, this.email, this.password)
          .then((userCredential) => {
            console.log("signedin:", userCredential);
            console.log("usuario estado:", this.currentUser)
            // Signed in 
            const user = userCredential.user;
            this.q.notify({
              type: 'positive',
              message: 'you are signed up successfully !',
              textColor: "dark",
              position: "top",
              actions: [{ icon: 'close', color: 'dark' }]
            }) 
          })
          .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/email-already-in-use") {
            this.q.notify({
              type: 'warning',
              message: 'User already exists',
              textColor: "dark",
              position: "top",
              actions: [{ icon: 'close', color: 'dark' }]
            })
            } else if (errorCode === "auth/weak-password") {
            this.q.notify({
              type: 'warning',
              message: 'Incorrect password, please type at least 6 characters',
              textColor: "dark",
              position: "top",
              actions: [{ icon: 'close', color: 'dark' }]
            })    
            } else {
            this.q.notify({
              type: 'warning',
              message: 'could not be registered',
              textColor: "dark",
              position: "top",
              actions: [{ icon: 'close', color: 'dark' }]
            })   
            } 
            // ..
          });          
      } else {
        //Log In
        signInWithEmailAndPassword(auth, this.email, this.password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            this.$emit('hasSignedIn', user);
            this.q.notify({
              type: 'positive',
              message: 'you are signed in successfully !',
              textColor: "dark",
              position: "top",
              actions: [{ icon: 'close', color: 'dark' }]
            }) 
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("el error fue: ", errorCode,errorMessage)
            this.q.notify({
              type: 'warning',
              message: 'User can not be signed in',
              textColor: "dark",
              position: "top",
              actions: [{ icon: 'close', color: 'dark' }]
            })
          });
      }

      //console.log("valor estado user: ---------",self.currentUser)
      this.email = ""
      this.password =""

    }
  },
  // mounted(){
  //   console.log("mounted: ", this.currrentUser);
  // },
  // updated(){
  //   console.log("se actualizó el DOM----")
  // }
};
</script>

<style lang="sass">
.container-log
  margin: 10px 340px 10px 340px

.margin-label
  margin: 12px 0px 20px 0px
</style>