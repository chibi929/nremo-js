import * as assert from 'assert';
import * as qs from 'qs';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { RemoClient } from './remo';

namespace TestResponseData {
  export const user = {
    id: 'test_id',
    nickname: 'test_nickname'
  };

  export const deviceCore = {
    id: 'test_id',
    name: 'test_name',
    temperature_offset: 123,
    humidity_offset: 123,
    created_at: 'test_created_at',
    updated_at: 'test_updated_at',
    firmware_version: 'test_firmware_version'
  };

  export const sensorValue = {
    value: 123,
    created_at: 'test_created_at'
  };

  export const device = deviceCore;
  device['newest_events'] = {
    te: sensorValue,
    hu: sensorValue
  };

  export const applianceModel = {
    id: 'test_id',
    manufacturer: 'test_manufacturer',
    remote_name: 'test_remote_name',
    name: 'test_name',
    image: 'test_image'
  };

  export const airConRangeMode = {
    temp: 'test_temp',
    vol: 'test_vol',
    dir: 'test_dir'
  };

  export const airConParams = airConRangeMode;
  airConParams['mode'] = 'test_mode';
  airConParams['button'] = 'test_button';

  export const AirCon = {
    range: {
      modes: {
        cool: airConRangeMode,
        warm: airConRangeMode,
        dry: airConRangeMode,
        blow: airConRangeMode,
        auto: airConRangeMode
      },
      fixedButtons: ['a', 'b', 'c']
    },
    tempUnit: 'test_tempUnit'
  };

  export const signal = {
    id: 'test_id',
    name: 'test_name',
    image: 'test_image'
  };

  export const appliance = {
    id: 'test_id',
    device: deviceCore,
    model: applianceModel,
    nickname: 'test_nickname',
    image: 'test_image',
    type: 'test_type',
    settings: airConParams,
    aircon: AirCon,
    signals: [signal]
  };

  export const applianceModelAndParam = {
    model: applianceModel,
    params: airConParams
  };

  export const infraredSignal = {
    format: 'test_format',
    freq: 39,
    data: [101, 102, 103]
  };
}

describe('RemoClient', function () {
  const client = new RemoClient("");
  const mock = new MockAdapter(axios);

  describe('fetchMe', function () {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onGet('/users/me').reply(200, TestResponseData.user);
      });

      it('ユーザー情報を返すこと', () => {
        return client.fetchMe().then(res => {
          const data = res.data;
          assert.equal(data.id, "test_id");
          assert.equal(data.nickname, "test_nickname");
        });
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onGet('/users/me').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.fetchMe().then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('updateMe', () => {
    describe('正常系', () => {
      beforeEach(() => {
        const responseData = {
          id: 'test_id',
          nickname: null
        }
        mock.onPost('/users/me').reply(req => {
          const params = qs.parse(req.data);
          responseData.nickname = params.nickname;
          return [200, responseData];
        });
      });

      it('ユーザーの更新情報が正しく POST できること', () => {
        return client.updateMe('hoge').then(res => {
          const data = res.data;
          assert.equal(data.id, "test_id");
          assert.equal(data.nickname, "hoge");
        });
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/users/me').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.updateMe('hoge').then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('fetchDevices', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onGet('/devices').reply(200, [TestResponseData.device]);
      });

      it('デバイス情報配列を返すこと', () => {
        return client.fetchDevices().then(res => {
          const data = res.data;
          assert.equal(data.length, 1);
          assert.equal(data[0].id, 'test_id');
          assert.equal(data[0].name, 'test_name');
          assert.equal(data[0].temperature_offset, 123);
          assert.equal(data[0].humidity_offset, 123);
          assert.equal(data[0].created_at, 'test_created_at');
          assert.equal(data[0].updated_at, 'test_updated_at');
          assert.equal(data[0].firmware_version, 'test_firmware_version');
          assert.equal(data[0].newest_events.te.value, 123);
          assert.equal(data[0].newest_events.te.created_at, 'test_created_at');
          assert.equal(data[0].newest_events.hu.value, 123);
          assert.equal(data[0].newest_events.hu.created_at, 'test_created_at');
        });
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onGet('/devices').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.fetchDevices().then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('updateRemo', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/devices/1').reply(req => {
          const params = qs.parse(req.data);
          assert.equal(params.name, 'Remo');
          return [200, {}];
        });
      });

      it('デバイスの更新情報が正しく POST できること', () => {
        return client.updateRemo('1', 'Remo');
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/devices/1').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.updateRemo('1', 'Remo').then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('deleteRemo', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/devices/1/delete').reply(200, {});
      });

      it('デバイスの削除情報が正しく POST できること', () => {
        return client.deleteRemo('1');
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/devices/1/delete').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.deleteRemo('1').then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('updateTemperatureOffset', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/devices/1/temperature_offset').reply(req => {
          const params = qs.parse(req.data);
          assert.equal(params.offset, 100);
          return [200, {}];
        });
      });

      it('センサーの更新情報が正しく POST できること', () => {
        return client.updateTemperatureOffset('1', 100);
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/devices/1/temperature_offset').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.updateTemperatureOffset('1', 100).then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('updateHumidityOffset', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/devices/1/humidity_offset').reply(req => {
          const params = qs.parse(req.data);
          assert.equal(params.offset, 100);
          return [200, {}];
        });
      });

      it('センサーの更新情報が正しく POST できること', () => {
        return client.updateHumidityOffset('1', 100);
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/devices/1/humidity_offset').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.updateHumidityOffset('1', 100).then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('findAirCon', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/detectappliance').reply(req => {
          const params = qs.parse(req.data);
          const message = JSON.parse(params.message);
          assert.equal(message.format, 'test_format');
          assert.equal(message.freq, 39);
          assert.deepEqual(message.data, [101, 102, 103]);
          return [200, [TestResponseData.applianceModelAndParam]];
        });
      });

      it('赤外線信号が正しく POST できること', () => {
        const message = {
          format: 'test_format',
          freq: 39,
          data: [101, 102, 103]
        };

        return client.findAirCon(message).then(res => {
          const data = res.data;
          assert.equal(data.length, 1);
          assert.equal(data[0].model.id, 'test_id');
          assert.equal(data[0].model.manufacturer, 'test_manufacturer');
          assert.equal(data[0].model.remote_name, 'test_remote_name');
          assert.equal(data[0].model.name, 'test_name');
          assert.equal(data[0].model.image, 'test_image');
          assert.equal(data[0].params.temp, 'test_temp');
          assert.equal(data[0].params.vol, 'test_vol');
          assert.equal(data[0].params.dir, 'test_dir');
          assert.equal(data[0].params.mode, 'test_mode');
          assert.equal(data[0].params.button, 'test_button');
        });
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/detectappliance').reply(400, {});
      });

      it('エラーが発生すること', () => {
        const message = {
          format: 'test_format',
          freq: 39,
          data: [101, 102, 103]
        };

        return client.findAirCon(message).then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('updateAirConSettings', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/appliances/1/aircon_settings').reply(req => {
          const data = qs.parse(req.data);
          assert.equal(data.temperature, 't');
          assert.equal(data.operation_mode, 'o');
          assert.equal(data.air_volume, 'v');
          assert.equal(data.air_direction, 'd');
          assert.equal(data.button, 'b');
          return [200, {}];
        });
      });

      it('エアコンの更新情報が正しく POST できること', () => {
        return client.updateAirConSettings('1', 't', 'o', 'v', 'd', 'b');
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/appliances/1/aircon_settings').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.updateAirConSettings('1', 't', 'o', 'v', 'd', 'b').then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('fetchAppliances', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onGet('/appliances').reply(200, [TestResponseData.appliance]);
      });

      it('家電の情報配列を返すこと', () => {
        return client.fetchAppliances().then(res => {
          const data = res.data;
          assert.equal(data.length, 1);
          assert.equal(data[0].id, 'test_id');
          assert.equal(data[0].device.id, 'test_id');
          assert.equal(data[0].device.name, 'test_name');
          assert.equal(data[0].device.temperature_offset, 123);
          assert.equal(data[0].device.humidity_offset, 123);
          assert.equal(data[0].device.created_at, 'test_created_at');
          assert.equal(data[0].device.updated_at, 'test_updated_at');
          assert.equal(data[0].device.firmware_version, 'test_firmware_version');
          assert.equal(data[0].model.id, 'test_id');
          assert.equal(data[0].model.manufacturer, 'test_manufacturer');
          assert.equal(data[0].model.remote_name, 'test_remote_name');
          assert.equal(data[0].model.name, 'test_name');
          assert.equal(data[0].model.image, 'test_image');
          assert.equal(data[0].nickname, 'test_nickname');
          assert.equal(data[0].image, 'test_image');
          assert.equal(data[0].type, 'test_type');
          assert.equal(data[0].settings.temp, 'test_temp');
          assert.equal(data[0].settings.vol, 'test_vol');
          assert.equal(data[0].settings.dir, 'test_dir');
          assert.equal(data[0].settings.mode, 'test_mode');
          assert.equal(data[0].settings.button, 'test_button');
          assert.equal(data[0].aircon.range.modes.cool.temp, 'test_temp');
          assert.equal(data[0].aircon.range.modes.cool.vol, 'test_vol');
          assert.equal(data[0].aircon.range.modes.cool.dir, 'test_dir');
          assert.equal(data[0].aircon.range.modes.warm.temp, 'test_temp');
          assert.equal(data[0].aircon.range.modes.warm.vol, 'test_vol');
          assert.equal(data[0].aircon.range.modes.warm.dir, 'test_dir');
          assert.equal(data[0].aircon.range.modes.dry.temp, 'test_temp');
          assert.equal(data[0].aircon.range.modes.dry.vol, 'test_vol');
          assert.equal(data[0].aircon.range.modes.dry.dir, 'test_dir');
          assert.equal(data[0].aircon.range.modes.blow.temp, 'test_temp');
          assert.equal(data[0].aircon.range.modes.blow.vol, 'test_vol');
          assert.equal(data[0].aircon.range.modes.blow.dir, 'test_dir');
          assert.equal(data[0].aircon.range.modes.auto.temp, 'test_temp');
          assert.equal(data[0].aircon.range.modes.auto.vol, 'test_vol');
          assert.equal(data[0].aircon.range.modes.auto.dir, 'test_dir');
          assert.deepEqual(data[0].aircon.range.fixedButtons, ['a', 'b', 'c']);
          assert.equal(data[0].aircon.tempUnit, 'test_tempUnit');
          assert.equal(data[0].signals.length, 1);
          assert.equal(data[0].signals[0].id, 'test_id');
          assert.equal(data[0].signals[0].name, 'test_name');
          assert.equal(data[0].signals[0].image, 'test_image');
        });
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onGet('/appliances').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.fetchAppliances().then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('createAppliance', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/appliances').reply(req => {
          const params = qs.parse(req.data);
          assert.equal(params.device, '1');
          assert.equal(params.nickname, 'hoge');
          assert.equal(params.image, 'foo');
          assert.equal(params.model, 'bar');
          return [200, TestResponseData.appliance];
        });
      });

      it('家電情報が正しく POST できること', () => {
        return client.createAppliance('1', 'hoge', 'foo', 'bar').then(res => {
          const data = res.data;
          assert.equal(data.id, 'test_id');
          assert.equal(data.device.id, 'test_id');
          assert.equal(data.device.name, 'test_name');
          assert.equal(data.device.temperature_offset, 123);
          assert.equal(data.device.humidity_offset, 123);
          assert.equal(data.device.created_at, 'test_created_at');
          assert.equal(data.device.updated_at, 'test_updated_at');
          assert.equal(data.device.firmware_version, 'test_firmware_version');
          assert.equal(data.model.id, 'test_id');
          assert.equal(data.model.manufacturer, 'test_manufacturer');
          assert.equal(data.model.remote_name, 'test_remote_name');
          assert.equal(data.model.name, 'test_name');
          assert.equal(data.model.image, 'test_image');
          assert.equal(data.nickname, 'test_nickname');
          assert.equal(data.image, 'test_image');
          assert.equal(data.type, 'test_type');
          assert.equal(data.settings.temp, 'test_temp');
          assert.equal(data.settings.vol, 'test_vol');
          assert.equal(data.settings.dir, 'test_dir');
          assert.equal(data.settings.mode, 'test_mode');
          assert.equal(data.settings.button, 'test_button');
          assert.equal(data.aircon.range.modes.cool.temp, 'test_temp');
          assert.equal(data.aircon.range.modes.cool.vol, 'test_vol');
          assert.equal(data.aircon.range.modes.cool.dir, 'test_dir');
          assert.equal(data.aircon.range.modes.warm.temp, 'test_temp');
          assert.equal(data.aircon.range.modes.warm.vol, 'test_vol');
          assert.equal(data.aircon.range.modes.warm.dir, 'test_dir');
          assert.equal(data.aircon.range.modes.dry.temp, 'test_temp');
          assert.equal(data.aircon.range.modes.dry.vol, 'test_vol');
          assert.equal(data.aircon.range.modes.dry.dir, 'test_dir');
          assert.equal(data.aircon.range.modes.blow.temp, 'test_temp');
          assert.equal(data.aircon.range.modes.blow.vol, 'test_vol');
          assert.equal(data.aircon.range.modes.blow.dir, 'test_dir');
          assert.equal(data.aircon.range.modes.auto.temp, 'test_temp');
          assert.equal(data.aircon.range.modes.auto.vol, 'test_vol');
          assert.equal(data.aircon.range.modes.auto.dir, 'test_dir');
          assert.deepEqual(data.aircon.range.fixedButtons, ['a', 'b', 'c']);
          assert.equal(data.aircon.tempUnit, 'test_tempUnit');
          assert.equal(data.signals.length, 1);
          assert.equal(data.signals[0].id, 'test_id');
          assert.equal(data.signals[0].name, 'test_name');
          assert.equal(data.signals[0].image, 'test_image');
        });
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/appliances').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.createAppliance('1', 'hoge', 'foo', 'bar').then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('reorderAppliances', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/appliance_orders').reply(req => {
          const params = qs.parse(req.data);
          assert.equal(params.appliances, '1,2,3');
          return [200, {}];
        });
      });

      it('家電のオーダーが正しく POST できること', () => {
        return client.reorderAppliances(['1', '2', '3']);
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/appliance_orders').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.reorderAppliances(['1', '2', '3']).then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('deleteAppliance', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/appliances/1/delete').reply(200, {});
      });

      it('家電の削除情報が正しく POST できること', () => {
        return client.deleteAppliance('1');
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/appliances/1/delete').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.deleteAppliance('1').then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('updateAppliance', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/appliances/1').reply(req => {
          const params = qs.parse(req.data);
          assert.equal(params.nickname, 'hoge');
          assert.equal(params.image, 'foo');
          return [200, TestResponseData.appliance];
        });
      });

      it('家電の更新情報が正しく POST できること', () => {
        return client.updateAppliance('1', 'hoge', 'foo').then(res => {
          const data = res.data;
          assert.equal(data.id, 'test_id');
          assert.equal(data.device.id, 'test_id');
          assert.equal(data.device.name, 'test_name');
          assert.equal(data.device.temperature_offset, 123);
          assert.equal(data.device.humidity_offset, 123);
          assert.equal(data.device.created_at, 'test_created_at');
          assert.equal(data.device.updated_at, 'test_updated_at');
          assert.equal(data.device.firmware_version, 'test_firmware_version');
          assert.equal(data.model.id, 'test_id');
          assert.equal(data.model.manufacturer, 'test_manufacturer');
          assert.equal(data.model.remote_name, 'test_remote_name');
          assert.equal(data.model.name, 'test_name');
          assert.equal(data.model.image, 'test_image');
          assert.equal(data.nickname, 'test_nickname');
          assert.equal(data.image, 'test_image');
          assert.equal(data.type, 'test_type');
          assert.equal(data.settings.temp, 'test_temp');
          assert.equal(data.settings.vol, 'test_vol');
          assert.equal(data.settings.dir, 'test_dir');
          assert.equal(data.settings.mode, 'test_mode');
          assert.equal(data.settings.button, 'test_button');
          assert.equal(data.aircon.range.modes.cool.temp, 'test_temp');
          assert.equal(data.aircon.range.modes.cool.vol, 'test_vol');
          assert.equal(data.aircon.range.modes.cool.dir, 'test_dir');
          assert.equal(data.aircon.range.modes.warm.temp, 'test_temp');
          assert.equal(data.aircon.range.modes.warm.vol, 'test_vol');
          assert.equal(data.aircon.range.modes.warm.dir, 'test_dir');
          assert.equal(data.aircon.range.modes.dry.temp, 'test_temp');
          assert.equal(data.aircon.range.modes.dry.vol, 'test_vol');
          assert.equal(data.aircon.range.modes.dry.dir, 'test_dir');
          assert.equal(data.aircon.range.modes.blow.temp, 'test_temp');
          assert.equal(data.aircon.range.modes.blow.vol, 'test_vol');
          assert.equal(data.aircon.range.modes.blow.dir, 'test_dir');
          assert.equal(data.aircon.range.modes.auto.temp, 'test_temp');
          assert.equal(data.aircon.range.modes.auto.vol, 'test_vol');
          assert.equal(data.aircon.range.modes.auto.dir, 'test_dir');
          assert.deepEqual(data.aircon.range.fixedButtons, ['a', 'b', 'c']);
          assert.equal(data.aircon.tempUnit, 'test_tempUnit');
          assert.equal(data.signals.length, 1);
          assert.equal(data.signals[0].id, 'test_id');
          assert.equal(data.signals[0].name, 'test_name');
          assert.equal(data.signals[0].image, 'test_image');
        });
      })
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/appliances/1').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.updateAppliance('1', 'hoge', 'foo').then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('fetchApplianceSignals', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onGet('/appliances/1/signals').reply(200, [TestResponseData.signal]);
      });

      it('家電のシグナル情報配列が取得できること', () => {
        return client.fetchApplianceSignals('1').then(res => {
          const data = res.data;
          assert.equal(data.length, 1);
          assert.equal(data[0].id, 'test_id');
          assert.equal(data[0].image, 'test_image');
          assert.equal(data[0].name, 'test_name');
        });
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onGet('/appliances/1/signals').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.fetchApplianceSignals('1').then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('createApplianceSignal', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/appliances/1/signals').reply(req => {
          const params = qs.parse(req.data);
          const message = JSON.parse(params.message);
          assert.equal(message.format, 'test_format');
          assert.equal(message.freq, 39);
          assert.deepEqual(message.data, [101, 102, 103]);
          assert.equal(params.image, 'hoge');
          assert.equal(params.name, 'foo');
          return [200, TestResponseData.signal];
        });
      });

      it('家電のシグナル情報が正しく POST できること', () => {
        const message = {
          format: 'test_format',
          freq: 39,
          data: [101, 102, 103]
        };

        return client.createApplianceSignal('1', message, 'hoge', 'foo').then(res => {
          const data = res.data;
          assert.equal(data.id, 'test_id');
          assert.equal(data.image, 'test_image');
          assert.equal(data.name, 'test_name');
        });
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/appliances/1/signals').reply(400, {});
      });

      it('エラーが発生すること', () => {
        const message = {
          format: 'test_format',
          freq: 39,
          data: [101, 102, 103]
        };

        return client.createApplianceSignal('1', message, 'hoge', 'foo').then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('reorderApplianceSignals', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/appliances/1/signal_orders').reply(req => {
          const params = qs.parse(req.data);
          assert.deepEqual(params.signals, 'a,b,c');
          return [200, {}];
        });
      });

      it('家電のシグナル情報のオーダーが正しく POST できること', () => {
        return client.reorderApplianceSignals('1', ['a', 'b', 'c']);
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/appliances/1/signal_orders').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.reorderApplianceSignals('1', ['a', 'b', 'c']).then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('updateSignal', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/signals/1').reply(req => {
          const params = qs.parse(req.data);
          assert.deepEqual(params.image, 'hoge');
          assert.deepEqual(params.name, 'foo');
          return [200, {}];
        });
      });

      it('シグナルの更新情報を正しく POST できること', () => {
        return client.updateSignal('1', 'hoge', 'foo');
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/signals/1').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.updateSignal('1', 'hoge', 'foo').then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('deleteSignal', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/signals/1/delete').reply(200, {});
      });

      it('シグナルの削除情報を正しく POST できること', () => {
        return client.deleteSignal('1');
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/signals/1/delete').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.deleteSignal('1').then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });

  describe('sendSignal', () => {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onPost('/signals/1/send').reply(200, {});
      });

      it('シグナル情報を正しく POST できること', () => {
        return client.sendSignal('1');
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onPost('/signals/1/send').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.sendSignal('1').then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });
});
