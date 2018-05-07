import * as qs from 'qs';
import {
  AirCon,
  AirConParams,
  AirConRangeMode,
  Appliance,
  ApplianceModel,
  ApplianceModelAndParam,
  Device,
  DeviceCore,
  InfraredSignal,
  SensorValue,
  Signal,
  User
} from './models';
import { AxiosWrapper, AxiosPromise } from './axios-wrapper';

export interface IUsers {
  fetchMe(): AxiosPromise<User>;
  updateMe(nickname: string): AxiosPromise<User>;
}

export interface IDevices {
  fetchDevices(): AxiosPromise<Device[]>;
  updateRemo(device: string, name: string): AxiosPromise<void>;
  deleteRemo(device: string): AxiosPromise<void>;
  updateTemperatureOffset(device: string, offset: number): AxiosPromise<void>;
  updateHumidityOffset(device: string, offset: number): AxiosPromise<void>;
}

export interface IAppliances {
  findAirCon(message: InfraredSignal): AxiosPromise<ApplianceModelAndParam[]>;
  updateAirConSettings(appliance: string, temperature?: string, operation_mode?: string, air_volume?: string, air_direction?: string, button?: string): AxiosPromise<void>;
  fetchAppliances(): AxiosPromise<Appliance[]>;
  createAppliance(device: string, nickname: string, image: string, model?: string): AxiosPromise<Appliance>;
  reorderAppliances(appliances: string[]): AxiosPromise<void>;
  deleteAppliance(appliance: string): AxiosPromise<void>;
  updateAppliance(appliance: string, nickname: string, image: string): AxiosPromise<Appliance>;
  fetchApplianceSignals(appliance: string): AxiosPromise<Signal[]>;
  createApplianceSignal(appliance: string, message: InfraredSignal, image: string, name: string): AxiosPromise<Signal>;
  reorderApplianceSignals(appliance: string, signals: string[]): AxiosPromise<void>;
}

export interface ISignals {
  updateSignal(signal: string, image: string, name: string): AxiosPromise<void>;
  deleteSignal(signal: string): AxiosPromise<void>;
  sendSignal(signal: string): AxiosPromise<void>;
}

export class RemoClient implements IUsers, IDevices, IAppliances, ISignals {
  private readonly endpoint = 'https://api.nature.global';
  private readonly httpClient: AxiosWrapper;

  constructor(token: string, version: number = 1) {
    const baseUrl = `${this.endpoint}/${version}`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    this.httpClient = new AxiosWrapper(baseUrl, headers);
  }

  fetchMe(): AxiosPromise<User> {
    const api = '/users/me';
    return this.httpClient.get(api);
  }

  updateMe(nickname: string): AxiosPromise<User> {
    const api = '/users/me';
    const data = {
      nickname: nickname
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  fetchDevices(): AxiosPromise<Device[]> {
    const api = '/devices';
    return this.httpClient.get(api);
  }

  updateRemo(device: string, name: string): AxiosPromise<void>  {
    const api = `/devices/${device}`;
    const data = {
      name: name
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  deleteRemo(device: string): AxiosPromise<void> {
    const api = `/devices/${device}/delete`;
    return this.httpClient.post(api);
  }

  updateTemperatureOffset(device: string, offset: number): AxiosPromise<void> {
    const api = `/devices/${device}/temperature_offset`
    const data = {
      offset: offset
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  updateHumidityOffset(device: string, offset: number): AxiosPromise<void> {
    const api = `/devices/${device}/humidity_offset`;
    const data = {
      offset: offset
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  findAirCon(message: InfraredSignal): AxiosPromise<ApplianceModelAndParam[]> {
    const api = `/detectappliance`;
    const data = {
      message: JSON.stringify(message)
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  updateAirConSettings(appliance: string, temperature?: string, operation_mode?: string, air_volume?: string, air_direction?: string, button?: string): AxiosPromise<void> {
    const api = `/appliances/${appliance}/aircon_settings`;
    const data = {
      temperature: temperature,
      operation_mode: operation_mode,
      air_volume: air_volume,
      air_direction: air_direction,
      button: button
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  fetchAppliances(): AxiosPromise<Appliance[]> {
    const api = `/appliances`;
    return this.httpClient.get(api);
  }

  createAppliance(device: string, nickname: string, image: string, model?: string): AxiosPromise<Appliance> {
    const api = `/appliances`;
    const data = {
      device: device,
      nickname: nickname,
      image: image,
      model: model
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  reorderAppliances(appliances: string[]): AxiosPromise<void> {
    const api = `/appliance_orders`;
    const data = {
      appliances: appliances.join(',')
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  deleteAppliance(appliance: string): AxiosPromise<void> {
    const api = `/appliances/${appliance}/delete`;
    return this.httpClient.post(api);
  }

  updateAppliance(appliance: string, nickname: string, image: string): AxiosPromise<Appliance> {
    const api = `/appliances/${appliance}`;
    const data = {
      nickname: nickname,
      image: image
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  fetchApplianceSignals(appliance: string): AxiosPromise<Signal[]> {
    const api = `/appliances/${appliance}/signals`;
    return this.httpClient.get(api);
  }

  createApplianceSignal(appliance: string, message: InfraredSignal, image: string, name: string): AxiosPromise<Signal> {
    const api = `/appliances/${appliance}/signals`;
    const data = {
      message: JSON.stringify(message),
      image: image,
      name: name
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  reorderApplianceSignals(appliance: string, signals: string[]): AxiosPromise<void> {
    const api = `/appliances/${appliance}/signal_orders`;
    const data = {
      signals: signals.join(',')
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  updateSignal(signal: string, image: string, name: string): AxiosPromise<void> {
    const api = `/signals/${signal}`;
    const data = {
      image: image,
      name: name
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  deleteSignal(signal: string): AxiosPromise<void> {
    const api = `/signals/${signal}/delete`;
    return this.httpClient.post(api);
  }

  sendSignal(signal: string): AxiosPromise<void> {
    const api = `/signals/${signal}/send`;
    return this.httpClient.post(api);
  }
}
