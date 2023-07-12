const { createApp } = Vue;
  
const config = {
  domainName:"http://localhost:52579/",
  projectName : "MOTC",
  url:{
    AddDrawResults : "api/MOTC/AddDrawResults",
    getDrawResults : "api/MOTC/GetDrawResults",
    DeleteDrawRecordData : "api/MOTC/DeleteDrawRecordData",
    GetDrawDetailRecord:"api/MOTC/GetDrawDetailRecord",
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
      console.log(addTitleTxt);
      const data = {
        DrawRecord:{
          Title:addTitleTxt,
          CreateAcc : document.getElementById("user-id").innerHTML
        },
        DrawDetailRecordList : this.drawSymbolArr
      }

      console.log(data);

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

let oldApp = createApp({
  data(){
    return{
      message : "qq",
      drawItemArr:[]
    }
  },
  methods:{
    getdrawHistoryRecord: function(){

      let self = this;
      self.drawItemArr = [];

      let data = {
        CreateAcc :document.getElementById("user-id").innerHTML
      };
      axios.post(
        config.domainName + config.url.getDrawResults, 
        //mapData.data.Api.TestUrl + "api/FACOA/GetEventsData",
        data
        ).then(function (response) {
          //console.log(response);
          let results = response.data;
          if(results.Status === 1){        
            if(results.Data !== null){
              self.drawItemArr = results.Data;
              console.log(self.drawItemArr);
            }else{
              self.drawItemArr = [];
            }
          //alert("儲存成功");
          }else{
            console.log(response.ErrorMessage);
            alert("系統錯誤!");
          }
        });  
    },
    transDate:function(date){
      console.log(date);
      let dateStr = new Date(date);

      let year = dateStr.getFullYear(); // 获取年份
      let month = dateStr.getMonth() + 1; // 获取月份，注意月份是从0开始计算的，所以我们需要加1
      let day = dateStr.getDate(); // 获取日
      let hours = dateStr.getHours(); // 获取小时
      let minutes = dateStr.getMinutes(); // 获取分钟
      let seconds = dateStr.getSeconds(); // 获取秒
      //let milliseconds = dateStr.getMilliseconds(); // 获取毫

      let dateFullStr = year.toString() + "/" + month.toString() + "/" + day.toString() + "  " + hours.toString() + ":" + minutes.toString() + ":" + seconds.toString();  
      //console.log(a);
      return dateFullStr;
      //return year.toString() + "/" + month.toString() + "/" + day.toString() + "  " + hours.toString() + ":" + minutes.toString() + ":" + seconds.toString();
    },
    deleteDrawRecordData:function(indexNo){

      let isDelete = confirm("確認刪除本筆資料??"); 

      if(isDelete){

        let self = this;

        let data = {
          IndexNo : indexNo,
          CreateAcc :document.getElementById("user-id").innerHTML
        };
      axios.post(
        config.domainName + config.url.DeleteDrawRecordData, 
        //mapData.data.Api.TestUrl + "api/FACOA/GetEventsData",
        data
        ).then(function (response){
          
          let results = response.data;
          console.log(results);
          if(results.Status === 1){                 
              self.drawItemArr = (results.Data === null || results.Data.length === 0) ? [] : results.Data;
              //console.log(self.drawItemArr);
              alert("刪除成功!~~");           
          //alert("儲存成功");
          }else{
            self.drawItemArr = results.Data;
            alert("刪除失敗!~~");
          }
        });
      }
    },
    loadDrawDetailRecord:function(indexNo){
      addApp.drawSymbolArr = [];

      let self = this;

      let data = {
        IndexNo : indexNo,        
      };

      axios.post(
        config.domainName + config.url.GetDrawDetailRecord, 
        //mapData.data.Api.TestUrl + "api/FACOA/GetEventsData",
        data
        ).then(function (response){
          
          let results = response.data;
          /*console.log(results);
          if(results.Status === 1){                 
              self.drawItemArr = (results.Data === null || results.Data.length === 0) ? [] : results.Data;
              //console.log(self.drawItemArr);
              alert("刪除成功!~~");           
          //alert("儲存成功");
          }else{
            self.drawItemArr = results.Data;
            alert("刪除失敗!~~");
          }*/
          axios.post(
            config.domainName + config.url.GetDrawDetailRecord, 
            //mapData.data.Api.TestUrl + "api/FACOA/GetEventsData",
            data
            ).then(function (response){
              
              let results = response.data;
              console.log(results);
              if(results.Status === 1){
                addApp.drawSymbolArr = results.Data;
              }
              //if(results.Status === 1){
                //if(results.Data){

                //}else{
                  
                //}                 
                  //self.drawItemArr = (results.Data === null || results.Data.length === 0) ? [] : results.Data;
                  //console.log(self.drawItemArr);
                  //alert("刪除成功!~~");           
              //alert("儲存成功");
              //}else{
                //self.drawItemArr = results.Data;
                //alert("刪除失敗!~~");
              //}
            });

        });      

      $('#historyListBox').show();
    },
  }
}).mount('#fileListBoxApp');