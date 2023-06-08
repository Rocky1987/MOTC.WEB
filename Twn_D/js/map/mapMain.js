
let mapConfig = {
    entity:{},
    source:null,
    vector:null,
    snap:null,
}

let drawInfo = {
    chooseObj : null,
};

mapMain = {
    data:{      
        centerLongitudeLatitude:ol.proj.fromLonLat([120.2278, 22.5243]),   
        draw:null,
    },
    methods:{
        initMap:function(){

           mapConfig.source = new ol.source.Vector();
           mapConfig.vector = new ol.layer.Vector({
            source: mapConfig.source,
            style: new ol.style.Style(
                /*{
                fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2,
                }),
                image: new ol.style.Circle ({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ED0000',   //預設為紅色
                }),
                }),
                }*/
                ),
            }); 

            mapConfig.entity.olMap = //_map; //全域老外的map            
            new ol.Map({
             target: 'mapView',
              layers: [
                new ol.layer.Tile({
                  source: new ol.source.OSM()
                }),mapConfig.vector
                //layer
              ],
              view: new ol.View({
                center: mapMain.data.centerLongitudeLatitude,
                zoom: 12
              })
            });

            const modify = new ol.interaction.Modify({source: mapConfig.source});
            mapConfig.entity.olMap.addInteraction(modify);
        },
        addInteractions:function(){
            //取得畫的類別

            //取得畫的顏色
            //debugger;
            let colorType = "#ED0000";
            let color = "red";
            for(let i=0; i < document.getElementsByClassName('symbo-color').length; i++){
                if(document.getElementsByClassName('symbo-color')[i].classList[2] === "on"){
                 //console.log(document.getElementsByClassName('symbo-color')[i].classList[1]);
                     color = document.getElementsByClassName('symbo-color')[i].classList[1]
                     
                    if(color === "red"){
                        colorType = "#ED0000";
                    }else if(color === "orange"){
                        colorType = "#F89B0C";
                    }else if(color === "yellow"){
                        colorType = "#EFC816";
                    }else if(color === "green"){
                        colorType = "#86CA32";
                    }else if(color === "blue"){
                        colorType = "#308ED6";
                    }else if(color === "pink"){
                        colorType = "#D430DA";
                    }else if(color === "purple"){
                        colorType = "#8E16EF";
                    }else if(color === "lightblue"){
                        colorType = "#16CBEF";
                    }                                      
                }                
            }

            //取得畫的圖徵資訊
            let symbolInfo = drawInfo.chooseObj.id;
           
            //console.log(symbolInfo);
            let symbolInfoArr = symbolInfo.split("-");
            let type = "";
            switch(symbolInfoArr[2]){
                case "point":
                    type = "Point"
                    break;
                case "line":
                    type = "LineString"
                    break;
                case "multiline":
                    type = "LineString"
                    break;
                case "square":
                    type = "Polygon"
                    break;
                case "circle":
                    type = "Circle"
                    break;
            }
       

            /*var drawStyle = function(feature) {
                // 定义要素的样式
                var style = new ol.style.Style({
                  fill: new ol.style.Fill({
                    color: 'rgba(255, 0, 0, 0.2)' // 填充颜色
                  }),
                  stroke: new ol.style.Stroke({
                    color: 'red', // 边界颜色
                    width: 2 // 边界宽度
                  }),
                  image: new ol.style.Circle({
                    radius: 6, // 圆的半径
                    fill: new ol.style.Fill({
                      color: 'rgba(255, 0, 0, 0.5)' // 圆的填充颜色
                    }),
                    stroke: new ol.style.Stroke({
                      color: 'red', // 圆的边界颜色
                      width: 2 // 圆的边界宽度
                    })
                  })
                });
                
                return [style]; // 返回样式数组
              };*/

            mapMain.data.draw = new ol.interaction.Draw({
                source: mapConfig.source,
                type: type,
                //style: drawStyle // 应用自定义样式函数
              });

              //let features = mapConfig.vector.getSource().getFeatures();

              //console.log(features);

              // 添加繪製完成事件監聽器
            mapMain.data.draw.on('drawend', function(event) {
                var feature = event.feature; // 繪製的要素                   
               
                //console.log(coordinates4326); // [lon, lat]
                //console.log(feature.getGeometry());
                const id = Math.random().toString(36).substring(2, 9);
                //console.log(id);
                feature.setId(id);

                // 獲取要素的座標
                var coordinates = feature.getGeometry().getCoordinates();
                //console.log('繪製的座標:', coordinates);
                 // 執行坐標轉換
                 const coordinates4326 = proj4('EPSG:3857', 'EPSG:4326', [coordinates[0], coordinates[1]]);

                  // 在此处设置要素的样式
                  let style = null;
                  //console.log(symbolInfoArr[0]);
                if(type === "Point"){
                    if(symbolInfoArr[0] === "ui"){
                    style = new ol.style.Style({
                        // 设置样式的具体属性，例如填充颜色、边界颜色、边界宽度等
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 0, 0, 0.5)' // 填充颜色为半透明红色
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 1)', // 边界颜色为红色
                            width: 2 // 边界宽度为2个像素
                        }),
                        image: new ol.style.Circle ({
                            radius: 7,
                            fill: new ol.style.Fill({
                                color: colorType,   //決定要畫的顏色
                            }),
                        }),
                        // 更多样式属性...
                    });
                  }
                  else if(symbolInfoArr[0] === "symbol" || symbolInfoArr[0] === "mark"){
                   
                    let imageLink = "draw_" + symbolInfoArr[0].replace("l","") + "_" + symbolInfoArr[1] + "_" + color+ ".svg";
                      style = new ol.style.Style({
                        image: new ol.style.Icon({
                          anchor: [0.5, 20],
                          anchorXUnits: 'fraction',
                          anchorYUnits: 'pixels',
                          src: "Twn_D/img/draw_icon/" + imageLink,
                        }),
                      });
                  }
                }

                feature.setStyle(style); 
                //addApp.addDrawSymbolArr(id,coordinates4326[0],coordinates4326[1],symbolInfoArr[0],symbolInfoArr[1],color);  
                addApp.drawSymbolArr.push({
                    id:id,
                    lon:coordinates4326[0],
                    lat:coordinates4326[1],
                    Type:symbolInfoArr[0].replace("l",""),
                    DetailType:symbolInfoArr[1],
                    Color:color
                });        
            });
  

              mapConfig.entity.olMap.addInteraction(mapMain.data.draw);
              
              //snap = new Snap({source: source});
              //map.addInteraction(snap);
              mapConfig.snap = new ol.interaction.Snap({source: mapConfig.source});
              //mapConfig.entity.olMap.addInteraction(mapConfig.snap);           
        },
        starDraw:function(thisObj){
            drawInfo.chooseObj = thisObj;
            //console.log(thisObj);
            mapConfig.entity.olMap.removeInteraction(mapMain.data.draw);
            //mapConfig.entity.olMap.removeInteraction(mapConfig.snap);
            mapMain.methods.addInteractions();
        },
        cancel:function(){
            mapConfig.entity.olMap.removeInteraction(mapMain.data.draw);
        }
    }
}
//console.log(mapMain.data.centerLongitudeLatitude);
//console.log(ol.Map);
//console.log(ol.color);
mapMain.methods.initMap();