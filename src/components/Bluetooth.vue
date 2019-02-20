<template>
  <div class="hello">
    <input type="text" v-model="myValue">
    <p>{{msg}}</p>
    <p>
      <button @click="find">测试</button>
      <!-- <button @click="exit">断开连接</button> -->
    </p>
    <!-- <div>{{"deviceId="+deviceId+' '+"serviceId="+serviceId+'characteristicId='+characteristicId}}</div>
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
    </ul> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      myValue: "",
      msg: "",
      deviceId: null,
      serviceId: null,
      characteristicId: null,
      deviceList: [],
      serviceList: [],
      characteristicList: []
    };
  },
  methods: {
    find(){
      this.$alipayBluetooth.startBluetoothDevicesDiscovery()
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
