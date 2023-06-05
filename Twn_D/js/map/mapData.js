const { createApp } = Vue
  
let a = createApp({
  data() {
    return {
      message: 'Hello Vue!',
      account:document.getElementById("user-id").innerHTML
    }
  }
}).mount('#app')