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
    },
    removeDrawSymbolArrItem:function(index, featureId){
      alert("確定移除本項目??");
      //console.log(index);
      this.drawSymbolArr.splice(index, 1);
      const featureById = mapConfig.vector.getSource().getFeatureById(featureId);
      mapConfig.source.removeFeature(featureById);    
    },
    addDrawResults:function(){
      alert("ok");
    }
  }
}).mount('#historyListBox')