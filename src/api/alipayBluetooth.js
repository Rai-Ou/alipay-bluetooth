// 搜索附件的蓝牙设备
const startBluetoothDevicesDiscovery = () => {
  // 初始化本机蓝牙
  ap.openBluetoothAdapter({
    success: function(res) {
      // alert(JSON.stringify(res));
      if (!res.isSupportBLE) {
        ap.alert("抱歉，您的手机不支持 BLE");
      } else {
        // 获取本机蓝牙状态
        ap.getBluetoothAdapterState({
          success: function(res) {
            // alert(JSON.stringify(res));
            if (!res.available) {
              ap.alert("抱歉，您的手机蓝牙暂不可用");
            }
            if (res.discovering) {
              ap.showToast("正在搜索蓝牙设备");
            } else {
              ap.startBluetoothDevicesDiscovery({
                services: [] // 传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
              });
              // 搜索到新的蓝牙设备时触发此事件
              ap.onBluetoothDeviceFound(function(res) {
                ap.alert(JSON.stringify(res.devices[0]));
              });
            }
          },
          fail: function(res) {
            ap.showToast(res.errorMessage);
          }
        });
      }
    },
    fail: function(res) {
      ap.showToast(res.errorMessage);
    }
  });
};

// 连接蓝牙设备
const connectBLEDevice = deviceId => {
  ap.showToast("开始连接");

  ap.connectBLEDevice({
    deviceId: deviceId,
    success: function(res) {
      ap.showToast("链接成功");
    },
    fail: function(res) {
      ap.showToast("链接失败-" + res.errorMessage);
    }
  });
};
// 获取蓝牙设备所有 service（服务）。
const getService = deviceId => {
  ap.showToast("开始获取服务");
  // 获取蓝牙设备service值
  ap.getBLEDeviceServices({
    deviceId: deviceId,
    success: function(res) {
      alert(JSON.stringify(res.services));
    }
  });
};
// 获取蓝牙设备所有 characteristic（特征值）。
const getBLEDeviceCharacteristics = (deviceId, serviceId) => {
  ap.showToast("开始获取特征值");

  ap.getBLEDeviceCharacteristics({
    // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId: deviceId,
    // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
    serviceId: serviceId,
    success: function(res) {
      alert(JSON.stringify(res.characteristics));
    },
    fail: function(res) {
      ap.showToast("获取失败");
    }
  });
};
// 向蓝牙设备发送数据
const writeData=(deviceId,serviceId,characteristicId,value)=> {
    ap.showToast("开始写入");
    ap.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId: serviceId,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId: characteristicId,
      // 这里的value是 16 进制字符串
      value: value,
      success: function(res) {
        ap.alert("写入数据成功");
      },
      fail: function(res) {
        ap.showToast("写入数据失败");
      }
    });
  }
  // 监听蓝牙设备发送来的数据
 const readData=(deviceId,serviceId,characteristicId)=> {
    ap.showToast("开始监听");

    // 监听低功耗蓝牙设备的特征值变化的事件。
    ap.onBLECharacteristicValueChange(function(res) {
  
      ap.showToast( res.value);
    });
    // 启用低功耗蓝牙设备特征值变化时的 notify 功能。
    ap.notifyBLECharacteristicValueChange({
      // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId: serviceId,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId: characteristicId,
      success: function(res) {
        ap.alert("启动通知成功");
      },
      fail: function(res) {
        ap.showToast("启动通知失败");
      }
    });
  }
// 断开蓝牙设备
const exit = () => {
  ap.disconnectBLEDevice({
    deviceId: that.deviceId,
    success: function(res) {
      ap.alert("成功断开");
    },
    fail: function(res) {
      ap.showToast("断开失败-" + res.errorMessage);
    }
  });
};

export default {
  startBluetoothDevicesDiscovery: startBluetoothDevicesDiscovery,
  connectBLEDevice: connectBLEDevice,
  getService: getService,
  getBLEDeviceCharacteristics:getBLEDeviceCharacteristics,
  writeData:writeData,
  readData:readData,
  exit: exit
};
