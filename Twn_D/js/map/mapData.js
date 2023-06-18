const { createApp } = Vue;
  
const config = {
  domainName:"http://localhost:52579/",
  projectName : "MOTC",
  url:{
    AddDrawResults : "api/MOTC/AddDrawResults"
  }
};

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
      let isAdd = confirm("確認新增本次繪製結果??");

      if(!isAdd)
      {
        return;
      }

      const addTitleTxt = document.getElementById("addTitleTxt").value;

      if(addTitleTxt === ""){
        alert("請輸入標題名稱!");
        return;
      }

      if(this.drawSymbolArr.length === 0){
        alert("至少需繪製一筆圖徵!!");
        return;
      }

      let tempDataArr = [];

      //for(let i = 0; i < this.drawSymbolArr )

      const data = {
        DrawRecord:{
          Title:addTitleTxt,
          CreateAcc : document.getElementById("user-id").innerHTML
        },
        DrawDetailRecordList : this.drawSymbolArr
      }

      axios.post(
        config.domainName + config.url.AddDrawResults, 
        //mapData.data.Api.TestUrl + "api/FACOA/GetEventsData",
        data
        ).then(function (response) {
          console.log(response);
          let results = response.data;
          if(results.Status === 1){        
          document.getElementById("closeHistoryListBox").click();
          document.getElementById("addTitleTxt").value = "";
          alert("儲存成功");
          }else{
            console.log(response.ErrorMessage);
            alert("儲存失敗");
          }
        });
      
     
        
    }
  }
}).mount('#historyListBox');