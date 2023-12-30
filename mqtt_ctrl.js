import mqtt from 'https://unpkg.com/mqtt@5.3.0/dist/mqtt.esm.js'

export class MqttCtrl {

  constructor(mqttConfig) {
    this.addr = mqttConfig.addr;
    this.topic_states = mqttConfig.topic_states;
    this.topic_cmd = mqttConfig.topic_cmd;
    this.options = {
      // Clean session
      clean: true,
      connectTimeout: 4000,
      clientId: 'foc-ctrl-web',
      username: mqttConfig.user,
      password: mqttConfig.pass,
    }
  }

  connect(onConnect) {
    this.client = mqtt.connect(this.addr, this.options),

    this.client.on('connect', onConnect);
    
    this.client.on('end', function () {
      console.log('MQTT end')
    })

    this.client.on('close', function () {
      console.log('MQTT closed')
    })

    this.client.on('error', function (err) {
      console.error('MQTT error', err)
    })

    
  }

  subscribe(callback) {
    this.client.subscribe(this.topic_states, callback)
  }

  onMessage (messageCallback) {
    this.client.on('message', messageCallback)
  }

  unsubscribe() {
    this.client.unsubscribe(this.topic_states, function (err) {
      if (err) {
        console.error('MQTT unsubscribe', err)
      } else {
        console.log('MQTT unsubscribed')
      }
    })
  }

  send(key, val) {
    let cmd = {
      key: key,
      val: parseFloat(val)
    };
    
    this.client.publish(this.topic_cmd, JSON.stringify(cmd), function (err) {
      if (err) {
        console.error('MQTT publish', err)
      } else {
        console.log('MQTT published', JSON.stringify(cmd))
      }
    })
  }
}




