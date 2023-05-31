var sTrail;
var sLonLat = [];
var shipTrack = [];
var shipContainer = {}; // 針對ship Id進行歸類
var list = [];
var shipRoute = {}; // 存MMSI及顏色

var ul = document.querySelector('.ship-list-upload')
const fileUploader = document.querySelector('#uploadFile');


fileUploader.addEventListener('change', (e) => {
  reloadData();
  //console.log(e.target.files[0]);
  let file = e.target.files[0]; // get file object
  Papa.parse(file, {
    download: true,
    // rest of config ...
    header: true,
    complete: function (results) {
      //console.log(results.data);
      results.data.forEach(item => {
        shipContainer[item.MMSI] = shipContainer[item.MMSI] || [];
        shipContainer[item.MMSI].push({
          'Local Time': item['Local Time'],
          'Type': item['Type'],
          'Name': item['Name'],
          'LonLat': ol.proj.fromLonLat([item['Longitude'], item['Latitude']])
        });
      });

      delete shipContainer[''];
      delete shipContainer['undefined'];

      var fruitName = Object.keys(shipContainer);

      fruitName.forEach(key => {
        sLonLat = [];
        sTrail = [];
        //console.log(sTrail);

        // Math.pow is slow, use constant instead.
        let color = Math.floor(Math.random() * 16777216).toString(16);

        let shipColor = '#000000'.slice(0, -color.length) + color;

        let total = shipContainer[key]["length"];
        //console.log(routeColor);

        list += `         
               <li >
                  <label for="target${key}">
                  <div class="item-group" style="border-color: ${shipColor};">
                  <div class="item-name">Ship Name</div>
                  <div class="item-val">${shipContainer[key][0]['Name']}</div>
                  <div class="item-name">MMSI</div>
                  <div class="item-val">${key}</div>
                  <div class="item-name">Call Sign</div>
                  <div class="item-val">${shipContainer[key][0]['Type']}</div>
                  <div class="item-name">Start Time</div>
                  <div class="item-val">${shipContainer[key][0]['Local Time']}</div>
                  <div class="item-name">End Time</div>
                  <div class="item-val">${shipContainer[key][total - 1]['Local Time']}</div>
                  </div>
                  <div class="control-item">
                  <input type="checkbox" checked id="target${key}" name='${key}' onchange='handleChange(this);'>
                  </div>
                  </label>
                  <!-- <div class="del-ship-upload">
                    <img src="../img/icon_close.svg" alt="">
                  </div> -->
                </li>`;

        ul.innerHTML = list;

        shipContainer[key].forEach(ship => {
          sLonLat.push(ship['LonLat']);
          sTrail = new ol.geom.LineString(sLonLat);
        })

        // 線、箭頭格式
        var styleFunc = function (feature) {
          geometry = feature.getGeometry();
          var styles = [
            // 路徑(線)
            new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: routeColor[key],
                width: 2,

              }),
            })
          ];

          // 箭頭(行徑方向)
          geometry.forEachSegment(function (start, end) {
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            // arrows
            styles.push(
              new ol.style.Style({
                geometry: new ol.geom.Point(end),

                image: new ol.style.Icon({
                  anchor: [0.75, 0.5],
                  rotateWithView: true,
                  rotation: -rotation,
                  src: 'https://openlayers.org/en/latest/examples/data/arrow.png'
                }),
              })
            )
          });

          return styles;
        };

        // geo Feature
        var tFeature = new ol.Feature({
          geometry: sTrail,
          name: key,
        });

        // 路徑圖層
        var tLayer = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: [tFeature]
          }),
          style: styleFunc
        });

        _map.addLayer(tLayer); // 將圖層加入目前地圖

        // 存每個船的Id和圖層
        shipRoute[key] = {
          'color': routeColor,
          'tLayer': tLayer
        };
        console.log(shipRoute);
        // 移動到船隻路徑
        var tView = new ol.View();
        tView.fit(sTrail, {
          size: _map.getSize(),
          padding: [150, 150, 150, 150]
        });
        var vOrig = _map.getView();
        _map.setView(tView);

      })
    }
  })
})

// upload改變時重載
function reloadData() {
  clearALL();
  list = [];
  ul.innerHTML = '';
  routeColor = {};
  shipContainer = [];
}

// 個別路徑勾選
function handleChange(checkbox) {
  if (checkbox.checked == true) {
    _map.addLayer(shipRoute[checkbox.name]['tLayer']);
  } else {
    _map.removeLayer(shipRoute[checkbox.name]["tLayer"]);
  }
}

// 清除全部圖層
function clearALL() {
  for (var k in shipRoute) {
    _map.removeLayer(shipRoute[k]["tLayer"]);
  }
}

// 全選和全不選
document.getElementById('allCheck').onclick = function () {
  let checkboxes = document.querySelectorAll('.ship-list-upload input');
  for (var checkbox of checkboxes) {
    checkbox.checked = this.checked;
    if (checkbox.checked) {
      _map.addLayer(shipRoute[checkbox.name]["tLayer"]);
    } else {
      _map.removeLayer(shipRoute[checkbox.name]["tLayer"]);
    }
  }
} 
