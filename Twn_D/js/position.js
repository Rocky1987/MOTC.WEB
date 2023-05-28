var lat, lon;
var latD, latM, latS;
var lonD, lonM, lonS;
var lLocs; //儲存經緯度打點圖層

_map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([120.234131, 22.648117]),
    zoom: 16
  })
});


let coordinateType = 0; //0 = 度分秒, 1 = 緯經度
let ddTo = document.getElementById('btnChange').addEventListener('click', () => {
  var lat4 = document.getElementById('latitude04').value;
  var lat3 = document.getElementById('latitude03').value;
  var lat2 = document.getElementById('latitude02').value;
  var lat1 = document.getElementById('latitude01').value;
  var lon4 = document.getElementById('longitude04').value;
  var lon3 = document.getElementById('longitude03').value;
  var lon2 = document.getElementById('longitude02').value;
  var lon1 = document.getElementById('longitude01').value;
  console.log("現在是:", coordinateType);
  console.log(lat4, lat3, lat2, lat1, lon4, lon3, lon2, lon1)
  if (coordinateType === 0) { // 如果是度分秒
    if (lat4 != '' && lon4 != '') {
      $(".dms").show();
      $(".decimal").hide();
      $(this).text("切換十進位");
      transforDMS();
      coordinateType = 1;
    } else {
      alert("請檢查座標是否輸入正確")
    }
  } else { // 如果是緯經度
    if (lon3 != '' && lon2 != '' && lon1 != '' && lat3 != '' && lat2 != '' && lat1 != '') {

      $(".dms").hide();
      $(".decimal").show();
      $(this).text("切換度分秒");
      transforDMS();
      coordinateType = 0;
    } else {
      alert("請檢查座標是否輸入正確")
    }
  }
});

// let dddd = document.getElementById('btnSearch').addEventListener('click', () => {
//   //transforDMS();
// console.log('fuck');

// })

// 元件有另加id

let dmsTo = document.getElementById('btnSearch').addEventListener('click', () => {
  transforDMS();

  // Openlayers 打點

  // Style 這邊可以客製Marker，目前先用openlayers提供的icon
  var iconLoc = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: '../img/icon_mark.svg'
      // src: 'http://111.235.250.83/VTS/img/ship_cargo.svg'
    })
  });

  // Vector Layer
  lLocs = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    }),
    style: iconLoc
  });
  _map.addLayer(lLocs); // 把這個layer加到現有圖台


  // MPB (25.025402, 121.546989) 寫死一個位置，航港局座標
  //var loc = ol.proj.fromLonLat([ConvertDMSToDD(lonD, lonM, lonS, "W"), ConvertDMSToDD(latD, latM, latS, "S")]);
  var loc = ol.proj.fromLonLat([lon, lat]);
  var fLoc = new ol.Feature({
    geometry: new ol.geom.Point(loc),
    name: 'MPB. MOTC.',
  });
  var vLoc = new ol.View({
    center: loc,
    zoom: 8.999999999999998
  });
  lLocs.getSource().addFeature(fLoc); // 加入Feature(Marker)
  vOrig = _map.getView() // 把目前圖台的View暫存起來
  _map.setView(vLoc); // 飛到定位點
});

let dmsClr = document.getElementById('btnClear').addEventListener('click', () => {
  _map.removeLayer(lLocs);
  document.getElementById('latitude04').value = '';
  document.getElementById('latitude03').value = '';
  document.getElementById('latitude02').value = '';
  document.getElementById('latitude01').value = '';
  document.getElementById('longitude04').value = '';
  document.getElementById('longitude03').value = '';
  document.getElementById('longitude02').value = '';
  document.getElementById('longitude01').value = '';
});


function transforDMS() {

  _map.removeLayer(lLocs);

  lat = parseFloat(document.getElementById("latitude04").value);
  lon = parseFloat(document.getElementById("longitude04").value);


  if (!lat || !lon) {
    latD = parseInt(document.getElementById('latidms1').value);
    lonD = parseInt(document.getElementById('longidms1').value);

    latM = parseInt(document.getElementById('latidms2').value);
    lonM = parseInt(document.getElementById('longidms2').value);

    latS = document.getElementById('latidms3').value;
    lonS = document.getElementById('longidms3').value;

    // direction 先寫死
    lat = ConvertDMSToDD(latD, latM, latS, "E");
    lon = ConvertDMSToDD(lonD, lonM, lonS, "N")
  } else {
    latD = parseInt(lat);
    lonD = parseInt(lon);

    document.getElementById('latitude01').value = latD;
    document.getElementById('longitude01').value = lonD;

    let t = (lat - latD) * 60,
      i = (lon - lonD) * 60;

    latM = parseInt(t);
    lonM = parseInt(i);

    let s = (t - latM) * 60,
      h = (i - lonM) * 60;

    latS = parseInt(s * 100) / 100;
    lonS = parseInt(h * 100) / 100;

    document.getElementById('latitude02').value = latM;
    document.getElementById('longitude02').value = lonM;

    document.getElementById('latitude03').value = latS;
    document.getElementById('longitude03').value = lonS;
  }
}

//度分秒座標轉換經緯度
function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + (minutes / 60) + (seconds / 3600);

  if (direction == "S" || direction == "W") {
    dd *= -1;
  } // Don't do anything for N or E
  return dd;
}





// $(function () {
//   $("#ddto").click(function () {
//     lat = parseFloat($("#lati").val());
//       lon = parseFloat($("#longi").val());

//       latD = parseInt(lat);
//     lonD = parseInt(lon);

//    let t = (lat - latD) * 60,
//     i = (lon - lonD) * 60;
//     
//     latM = parseInt(t),
//     lonM = parseInt(i);

//     let s = (t - latM) * 60,
//       h = (i - lonM) * 60;

//     $("#latidms1").val(latD);
//     $("#longidms1").val(lonD);
//     $("#latidms2").val(latM);
//     $("#longidms2").val(lonM);
//     $("#latidms3").val(parseInt(s * 100) / 100);
//     $("#longidms3").val(parseInt(h * 100) / 100);

//   });
// })

// Removal 清除並飛回暫存的View，如需要請自行移除註解
// _map.removeLayer(lLocs);
// _map.setView(vOrig);
