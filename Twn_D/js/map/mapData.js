const { createApp } = Vue
  
let addApp = createApp({
  data() {
    return {
      message: 'Hello Vue!',
      account:document.getElementById("user-id").innerHTML,
      drawSymbolArr:[],
    }
  },
  methods:{
    addDrawSymbolArr:function(id,lon, lat, type, detailType, color){
      this.drawSymbolArr.push({
        id:id,
        lon:lon,
        lat:lat,
        Type:type,
        DetailType:detailType,
        Color:color
      });
      console.log(addDrawSymbolArr);
    }
  }
}).mount('#historyListBox')