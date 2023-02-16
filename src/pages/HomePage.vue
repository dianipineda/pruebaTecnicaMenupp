<template>
  <q-page>
    <div>
      <!-- form -->
      <div class="row justify-center items-center q-px-md" v-cloak>
        <!-- inputImage -->
        <q-file
          bottom-slots
          v-model="inputImage"
          label="Upload your image here"
          autogrow
          accept="image/*"
          ref="myFile"       
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop.prevent />
          </template>
          <template v-slot:append>
            <q-icon
              name="close"
              @click.stop.prevent="inputImage = null"
              class="cursor-pointer"
            />
          </template>
        </q-file>
      </div>
      <div class="row justify-center items-center">        
        <!-- btn -->
        <q-btn
          :disable="!inputImage || inputImage == 0"
          label="Submit"
          color="dark"
          class="text-white"
          @click.prevent="uploadImage"              
        />          
      </div>
      <br>
  
      <!-- space -->
      <q-separator size="5px" color="positive"/>
      <q-scroll-area style="height: 750px; max-width: 1100px;">
        <div class="q-pr-xl">
          <!-- posted images -->
          <div class="doc-container">
            <div class="row">
              <!-- card-->
              <div class="col-12">
                <q-card
                class="separator"
                flat
                bordered
                style="width: 750px"
                v-for="image in dataImages"
                :key="image.id"    
                >
                  <!-- image-->
                  <q-img 
                  class="img-fluid"
                  style="width: 750px;"
                  :src="image.image"
                  
                  />       
                  <!-- info image-->
                  <q-card-section>
                    <div class="row justify-between" >
                      <span class="col q-mx-xs gt-xs font-label">&bull; name: {{image.name}}</span>
                    </div>
                  </q-card-section>
                  <!-- space -->
                  <q-separator inset />
                  <!-- buttons -->
                  <div class="row justify-between gt-xs">
                    <div class="col column inline">
                      <q-btn
                        @click="downloadImage(image.image)"
                        flat                
                        icon="fa-solid fa-cloud-arrow-down"
                        color="dark" 
                        label="download"
                        size="10px"
                        />
                    </div>
                    <div class="col column inline">                
                        <q-btn 
                        @click="deleteImage(image.id, image.image)"
                        flat                
                        icon="fa-solid fa-trash"
                        color="dark" 
                        label="delete"
                        size="10px"
                        />
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </div>  
        </div>
      </q-scroll-area>
    </div>    
  </q-page>
</template>
<script>

import db from 'boot/firebase'
import { ref  as reference} from 'vue'
import { collection, onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth} from "firebase/auth";
const auth = getAuth()

const collectionRef = collection(db, "dataImages")
export default{
  name: "HomePage",
  data() {
    return {
      inputImage: reference(null),
      dataImages: reference([]), 
      currentUser: auth.currentUser
    };
  },
  
  methods: {

    uploadImage(){
      // Create a root reference
      const storage = getStorage();
      const storageRef = ref(storage, this.inputImage.name);
      const metadata = {
        contentType: 'image/png',
      };
      // 'file' comes from the Blob or File API to Storage
      const uploadTask = uploadBytesResumable(storageRef, this.inputImage,metadata)
      uploadTask.then(() => {
        console.log('Uploaded file!');
      })
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              return addDoc(collectionRef, {
                name: this.inputImage.name,
                image: url,
                date: new Date().getTime(),
                },
              )

            })
        }
      );
    },  
    downloadImage(link){
      //Create a reference with an initial file path and name
      const storage = getStorage(); 
      getDownloadURL(ref(storage, link)).then((url) => {
        // `url` is the download URL for 'images/stars.jpg'
        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
          let fileBlob = new Blob([xhr.response]);
              const url = window.URL.createObjectURL(fileBlob);
              const a = document.createElement('a');
              a.style.display = 'none';
              a.href = url;
              a.setAttribute("download", Date.now()+'imagen.png');
              document.body.appendChild(a);
              a.click();
              a.remove();
        };
        xhr.open('GET', url);
        xhr.send();
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error: " + error)
      });
      

    },
    deleteImage(id, link) {    

      deleteDoc(doc(db, "dataImages", id));
      //Delete from Storage ok
      const storage = getStorage();
      // Create a reference to the file to delete
      const desertRef = ref(storage, link);
      // Delete the file
      deleteObject(desertRef).then(() => {
        // File deleted successfully
      }).catch((error) => {
        console.error("Error es: " + error)
      });    
      
      //this.dataImages = this.dataImages.filter((item)=> item !== id);
    },
 
  },
  // igualo los documentos obtenidos de firebase con el array de referencia
  mounted(){
    onSnapshot(collectionRef, (querySnapshot) => {
      const dataImagesSnapshot = []
      querySnapshot.forEach((doc) => {
        dataImagesSnapshot.unshift({...doc.data(), id: doc.id})
      })
      this.dataImages = dataImagesSnapshot
      //console.log("id: ", this.dataImages[0].id)
      
    })  
  },
  // view changes in real time
  created() {

  }

  }

</script>

<style lang="sass">
.font-label 
  font-size: x-small 
.doc-container
  align-items: center
  margin: 10px 150px 10px 300px
.separator
  margin: 40px 0 40px 0

</style>