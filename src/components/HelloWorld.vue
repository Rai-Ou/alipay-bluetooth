<template>
  <div class="hello">
    <input type="text" v-model="myValue">
    <p>{{msg}}</p>
    <p>
      <button @click="startConnect">开始扫描</button>
      <button @click="exit">断开连接</button>
    </p>
    <div>{{"deviceId="+deviceId+' '+"serviceId="+serviceId+'characteristicId='+characteristicId}}</div>
    <ul>characteristic:
      <li
        v-for="item in characteristicList"
        :key="item.characteristicId"
        @click="write(item)"
      >{{item.characteristicId}}</li>
    </ul>
    <ul>serviceId:
      <li
        v-for="item in serviceList"
        :key="item.serviceId"
        @click="getBLEDeviceCharacteristics(item)"
      >{{item.serviceId}}</li>
    </ul>
    <ul>deviceId:
      <li
        v-for="item in deviceList"
        :key="item.deviceId"
        @click="connectBLEDevice(item)"
      >{{item.deviceName+" "+item.deviceId}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      myValue:'',
      msg:'',
      deviceId: null,
      serviceId: null,
      characteristicId: null,
      deviceList: [],
      serviceList: [],
      characteristicList: []
    };
  },
  methods: {
    // 连接蓝牙设备
    startConnect() {
      const that = this;
      that.deviceList = [];
      that.serviceList = [];
      that.characteristicList = [];
      // 初始化本机蓝牙
      ap.openBluetoothAdapter({
        success: function(res) {
          // alert(JSON.stringify(res));
          if (!res.isSupportBLE) {
            ap.alert("抱歉，您的手机不支持 BLE");
          } else {
            // 获取本机蓝牙状态

            that.getBluetoothAdapterState();
          }
        },
        fail: function(res) {
          ap.showToast(res.errorMessage);
        }
      });
      // 监听蓝牙变化
      ap.onBluetoothAdapterStateChange(function(res) {
        var available = res.available;

        if (available) {
          that.getBluetoothAdapterState();
        }
      });
    },

    // 获取本机蓝牙状态
    getBluetoothAdapterState() {
      const that = this;
      ap.getBluetoothAdapterState({
        success: function(res) {
          // alert(JSON.stringify(res));
          if (!res.available) {
            ap.alert("抱歉，您的手机蓝牙暂不可用");
          }
          if (res.discovering) {
            ap.showToast("正在搜索蓝牙设备");
          } else {
            that.startBluetoothDevicesDiscovery();
            // that.getConnectedBluetoothDevices();
          }
        },
        fail: function(res) {
          ap.showToast(res.errorMessage);
        }
      });
    },
    // 搜索附件蓝牙设备
    startBluetoothDevicesDiscovery() {
      const that = this;
      ap.startBluetoothDevicesDiscovery({
        services: [] // 传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
      });
      // 搜索到新的蓝牙设备时触发此事件
      ap.onBluetoothDeviceFound(function(res) {
        that.deviceList.push(res.devices[0]);

        // if (res.devices[0]) {
        //   var name = res.devices[0]["name"];

        //   if (name != "") {
        //     if (name.indexOf("FeiZhi") != -1) {
        //       var deviceId = res.devices[0]["deviceId"];

        //       that.deviceId = deviceId;

        //       that.connectBLEDevice();
        //     }
        //   }
        // }
      });
    },
    // 获取处于已连接状态的设备
    getConnectedBluetoothDevices() {
      ap.getConnectedBluetoothDevices({
        services: [], // 传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
        success: function(res) {
          // alert(JSON.stringify(res));
          // ap.alert("共发现" + res.devices.length + "个设备");

          // 查找目标设备
          var devices = res["devices"],
            flag = false,
            index = 0,
            conDevList = [];

          devices.forEach(function(value, index, array) {
            if (value["name"].indexOf("FeiZhi") != -1) {
              // 如果存在包含FeiZhi字段的设备

              flag = true;

              index += 1;

              conDevList.push(value["deviceId"]);

              that.deviceId = value["deviceId"];

              return;
            }
          });

          if (flag) {
            this.connectDeviceIndex = 0;

            that.loopConnect(conDevList);
          } else {
            if (!this.getConnectedTimer) {
              that.getConnectedTimer = setTimeout(function() {
                that.getConnectedBluetoothDevices();
              }, 5000);
            }
          }
        }
      });
    },
    // 断开链接
    exit() {
      const that = this;
      ap.disconnectBLEDevice({
        deviceId: that.deviceId,
        success: function(res) {
          ap.alert("成功断开");
          that.deviceId = null;
          that.serviceId = null;
          that.characteristicId = null;
        },
        fail: function(res) {
          ap.showToast("断开失败-" + res.errorMessage);
        }
      });
    },

    // 连接蓝牙设备
    connectBLEDevice(item) {
      ap.showToast("开始连接");
      const that = this;
      that.deviceId = item.deviceId;
      ap.connectBLEDevice({
        deviceId: item.deviceId,
        success: function(res) {
          ap.showToast("链接成功");
          // 获取蓝牙设备服务码
          that.getService();
        },
        fail: function(res) {
          ap.showToast("链接失败-" + res.errorMessage);
        }
      });
    },
    // 获取蓝牙设备所有 service（服务）。
    getService() {
      const that = this;
      ap.showToast("开始获取服务");
      // 监听蓝牙连接

      // ap.onBLEConnectionStateChange(function(res) {
      //   ap.showToast(res);
      // });

      // 获取蓝牙设备service值

      ap.getBLEDeviceServices({
        deviceId: that.deviceId,

        success: function(res) {
          that.serviceList = res.services;
          // alert(JSON.stringify(that.serviceList));
          // that.getBLEDeviceCharacteristics(that.deviceId, res.services);
        }
      });
    },
    // 获取蓝牙设备所有 characteristic（特征值）。
    getBLEDeviceCharacteristics(item) {
      const that = this;
      ap.showToast("开始获取特征值");
      that.serviceId = item.serviceId;
      ap.getBLEDeviceCharacteristics({
        // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
        deviceId: that.deviceId,
        // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
        serviceId: item.serviceId,
        success: function(res) {
          // alert(JSON.stringify(res));
          that.characteristicList = res.characteristics;
        },
        fail: function(res) {
          ap.showToast("获取失败");
        }
      });
    },
    write(item) {
      ap.showToast("开始写入");
      const that = this;
      let _value = that.stringToHex(that.myValue)
      ap.showToast(_value);
      // that.read(item);
      ap.writeBLECharacteristicValue({
        // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
        deviceId: that.deviceId,
        // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
        serviceId: that.serviceId,
        // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
        characteristicId: item.characteristicId,
        // 这里的value是 16 进制字符串
        value: "1234",
        success: function(res) {
          ap.alert("写入数据成功");
        },
        fail: function(res) {
          ap.showToast("写入数据失败");
        }
      });
    },
    read(item) {
      ap.showToast("开始监听");
      const that = this;
      // 监听低功耗蓝牙设备的特征值变化的事件。
      ap.onBLECharacteristicValueChange(function(res) {
        // var msg = "特征值变化：" + res.value;
        that.msg= res.value
      });
      // 启用低功耗蓝牙设备特征值变化时的 notify 功能。
      ap.notifyBLECharacteristicValueChange({
        // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
        deviceId: that.deviceId,
        // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
        serviceId: that.serviceId,
        // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
        characteristicId: item.characteristicId,
        success: function(res) {
          ap.alert("启动通知成功");
        },
        fail: function(res) {
          ap.showToast("启动通知失败");
        }
      });
    },
    // 转16进制
    stringToHex(str) {
      var val = "";
      for (var i = 0; i < str.length; i++) {
        if (val == "") val = str.charCodeAt(i).toString(16);
        else val +=  str.charCodeAt(i).toString(16);
      }
      return val;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
  height: 50px;
}
</style>
