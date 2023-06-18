
let mapConfig = {
    entity:{},
    source:null,
    vector:null,
    snap:null,
}

let drawInfo = {
    chooseObj : null,
    text:"無內容"
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
            //mapConfig.entity.olMap.addInteraction(modify);
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
                case "triangle":
                    type = "Polygon"
                    break;
                case "square":
                    type = "Polygon"
                    break;
                case "circle":
                    type = "Circle"
                    break;
                case "text":
                    type = "Point"
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
              //console.log(symbolInfoArr[0]);
                  //console.log(symbolInfoArr[2]);
                  //console.log(type);
              //type = "Circle";
            mapMain.data.draw = new ol.interaction.Draw({
                source: mapConfig.source,
                type: type,              
              });
              if(symbolInfoArr[2] === "square" && type === "Polygon"){
                    mapMain.data.draw = new ol.interaction.Draw({
                    source: mapConfig.source,
                    type: "Circle",
                    //style: drawStyle // 应用自定义样式函数
                    geometryFunction:ol.interaction.Draw.createBox()
                  });
              }else if(symbolInfoArr[2] === "triangle" && type === "Polygon"){
                    mapMain.data.draw = new ol.interaction.Draw({
                    source: mapConfig.source,
                    type: type,
                    maxPoints: 3,                
                  });
              }

              //mapMain.data.draw.geometryFunction = ol.interaction.Draw.createBox();
              //let features = mapConfig.vector.getSource().getFeatures();

              //console.log(features);

              // 添加繪製完成事件監聽器
            mapMain.data.draw.on('drawend', function(event) {
                var feature = event.feature; // 繪製的要素                                             
                let geometry = feature.getGeometry();      
                // 獲取要素的座標
                let coordinates = null;
                //紀錄圓形圖徵的圓心跟半徑
                let geoInfo = {
                    center:null,
                    radius: 0,
                }
                //圖徵如為多邊形計算其面積
                let area = 0;

                //紀錄座標資訊(多點以上才有)
                let coordsStr = "";

                if(geometry instanceof ol.geom.Polygon){
                    //console.log(feature.getGeometry().getArea());
                    let areaInSquareMeters = ol.sphere.getArea(geometry, {projection: 'EPSG:3857'});   
                    area = (areaInSquareMeters/1000000).toFixed(2);
                }

                if(type === "Circle"){
                    const circleGeometry = feature.getGeometry();
                    // 獲取圓心座標
                    geoInfo.center = circleGeometry.getCenter();                   
                    //console.log(center);
                    // 獲取半徑
                    geoInfo.radius = circleGeometry.getRadius().toFixed(4);
                    //console.log(radius);
                    let areaInSquareMeters = Math.PI * Math.pow(geoInfo.radius, 2);
                    area = (areaInSquareMeters/1000000).toFixed(2);

                }else{
                    coordinates = feature.getGeometry().getCoordinates();   
                    console.log('繪製的座標:', coordinates);
                }               
                //console.log(feature); // [lon, lat]
                if(symbolInfoArr[2] === "line" && coordinates.length !== 2){
                    alert("所畫直線僅能為2個點");
                    return;
                }
                
                //console.log('繪製的座標:', coordinates);
                //console.log(type);
                 // 執行坐標轉換
                 const id = Math.random().toString(36).substring(2, 9);
                //console.log(id);
                feature.setId(id);

                 let coordinates4326 = null;

            if(type === "Point"){
                  coordinates4326 = proj4('EPSG:3857', 'EPSG:4326', [coordinates[0], coordinates[1]]);
                  //console.log()
            }else if(type === "LineString"){
                //console.log(type);
                coordinates4326 = proj4('EPSG:3857', 'EPSG:4326', [coordinates[0][0], coordinates[0][1]]);
                coordsStr += "(";
                for(let i=0; i < coordinates.length; i++){
                    let point4326 = proj4('EPSG:3857', 'EPSG:4326', [coordinates[i][0], coordinates[i][1]]);
                    coordsStr += point4326[0].toFixed(4).toString() + " " + point4326[1].toFixed(4).toString();
                    if( i !== coordinates.length - 1){
                        coordsStr += ",";
                    }
                }
                coordsStr += ")";
                //console.log(coordinates4326);
            }else if(type === "Circle"){
                coordinates4326 = proj4('EPSG:3857', 'EPSG:4326', [geoInfo.center[0], geoInfo.center[1]]);
            }
            else if(type === "Polygon"){
                coordinates4326 = proj4('EPSG:3857', 'EPSG:4326', [coordinates[0][0][0], coordinates[0][0][1]]);
                //console.log(coordinates);
                coordsStr += "(";
                
                for(let i=0; i < coordinates[0].length; i++){
                    let point4326 = proj4('EPSG:3857', 'EPSG:4326', [coordinates[0][i][0], coordinates[0][i][1]]);
                    coordsStr += point4326[0].toFixed(4).toString() + " " + point4326[1].toFixed(4).toString();
                    if( i !== coordinates[0].length - 1){
                        coordsStr += ",";
                    }
                }
                coordsStr += ")";
            }
                 //console.log('繪製的座標:', coordinates4326);
                  // 在此处设置要素的样式
                  let style = null;               
                if(type === "Point"){
                    if(symbolInfoArr[0] === "ui"){
                        if(symbolInfoArr[2] === "text"){
                            style = new ol.style.Style({                       
                                image: new ol.style.Circle ({
                                    radius: 7,
                                    fill: new ol.style.Fill({
                                        color: colorType,   //決定要畫的顏色
                                    }),
                                }),
                                text: new ol.style.Text({
                                    text: drawInfo.text,
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                      color: '#000',
                                    }),
                                    stroke: new ol.style.Stroke({
                                      color: '#fff',
                                      width: 3,
                                    }),
                                }),
                                // 更多样式属性...
                            });
                        }else{
                            style = new ol.style.Style({                       
                                image: new ol.style.Circle ({
                                    radius: 7,
                                    fill: new ol.style.Fill({
                                        color: colorType,   //決定要畫的顏色
                                    }),
                                }),
                                // 更多样式属性...
                            });
                        }                   
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
                }else if(type === "LineString" || type === "Circle" || type==="Polygon"){
                    style = new ol.style.Style({                       
                        stroke: new ol.style.Stroke({
                            color: colorType, // 边界颜色为红色
                            width: 2 // 边界宽度为2个像素
                        }),                    
                    });
                }
                /*else if(type === "Circle" ){
                    style = new ol.style.Style({  
                       
                            stroke: new ol.style.Stroke({
                                color: colorType, // 边界颜色为红色
                                width: 2 // 边界宽度为2个像素
                            }),                      
                                         
                    });
                }*/

                feature.setStyle(style); 
                //addApp.addDrawSymbolArr(id,coordinates4326[0],coordinates4326[1],symbolInfoArr[0],symbolInfoArr[1],color);  
                addApp.drawSymbolArr.push({
                    id:id,
                    Lon:coordinates4326[0],
                    Lat:coordinates4326[1],
                    SymbolType:type,
                    DrawType:symbolInfoArr[0].replace("l",""),
                    DetailType:symbolInfoArr[1],
                    Color:color,
                    Area:area,
                    Coordinates : coordsStr !== "" ? coordsStr : null,
                    Radius:geoInfo.radius === 0 ? 0 : geoInfo.radius
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
        },
        cancelAndClearSymbol:function(){
            mapConfig.entity.olMap.removeInteraction(mapMain.data.draw);
            addApp.drawSymbolArr = [];
            mapConfig.vector.getSource().clear();
        },
        askUserBox:function(thisObj){
            let userInput = prompt("請輸入你的名字", "");

            if(userInput === null){
                return;
            }

            if(userInput === ""){
                alert("請輸入圖徵的文字!");
                return;
            }
            
            if(userInput.length > 20){
                alert("圖徵文字長度不可超過20個字!");
            }

            drawInfo.text = userInput;

            mapMain.methods.starDraw(thisObj);
            //console.log(userInput);

        }
    }
}
//console.log(mapMain.data.centerLongitudeLatitude);
//console.log(ol.Map);
//console.log(ol.color);
mapMain.methods.initMap();