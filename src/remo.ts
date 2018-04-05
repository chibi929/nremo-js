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
import {AxiosWrapper} from './axios-wrapper';

export interface IUsers {
  fetchMe(): Promise<User>;
  updateMe(nickname: string): Promise<User>;
}

export interface IDevices {
  fetchDevices(): Promise<Device[]>;
  updateRemo(device: string, name: string): Promise<void>;
  deleteRemo(device: string): Promise<void>;
  updateTemperatureOffset(device: string, offset: number): Promise<void>;
  updateHumidityOffset(device: string, offset: number): Promise<void>;
}

export interface IAppliances {
  findAirCon(message: InfraredSignal): Promise<ApplianceModelAndParam[]>;
  updateAirConSettings(appliance: string, temperature?: string, operation_mode?: string, air_volume?: string, air_direction?: string, button?: string): Promise<void>;
  fetchAppliances(): Promise<Appliance[]>;
  createAppliance(device: string, nickname: string, image: string, model?: string): Promise<Appliance>;
  reorderAppliances(appliances: string[]): Promise<void>;
  deleteAppliance(appliance: string): Promise<void>;
  updateAppliance(appliance: string, nickname: string, image: string): Promise<Appliance>;
  fetchApplianceSignals(appliance: string): Promise<Signal[]>;
  createApplianceSignal(appliance: string, message: InfraredSignal, image: string, name: string): Promise<Signal>;
  reorderApplianceSignals(appliance: string, signals: string[]): Promise<void>;
}

export interface ISignals {
  updateSignal(signal: string, image: string, name: string): Promise<void>;
  deleteSignal(signal: string): Promise<void>;
  sendSignal(signal: string): Promise<void>;
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

  fetchMe(): Promise<User> {
    const api = '/users/me';
    return this.httpClient.get(api);
  }

  updateMe(nickname: string): Promise<User> {
    const api = '/users/me';
    const data = {
      nickname: nickname
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  fetchDevices(): Promise<Device[]> {
    const api = '/devices';
    return this.httpClient.get(api);
  }

  updateRemo(device: string, name: string): Promise<void>  {
    const api = `/devices/${device}`;
    const data = {
      name: name
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  deleteRemo(device: string): Promise<void> {
    const api = `/devices/${device}/delete`;
    const data = {
      name: name
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  updateTemperatureOffset(device: string, offset: number): Promise<void> {
    const api = `/devices/${device}/temperature_offset`
    const data = {
      offset: offset
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  updateHumidityOffset(device: string, offset: number): Promise<void> {
    const api = `/devices/${device}/humidity_offset`;
    const data = {
      offset: offset
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  findAirCon(message: InfraredSignal): Promise<ApplianceModelAndParam[]> {
    const api = `/detectappliance`;
    const data = {
      message: JSON.stringify(message)
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  updateAirConSettings(appliance: string, temperature?: string, operation_mode?: string, air_volume?: string, air_direction?: string, button?: string): Promise<void> {
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

  fetchAppliances(): Promise<Appliance[]> {
    const api = `/appliances`;
    return this.httpClient.get(api);
  }

  createAppliance(device: string, nickname: string, image: string, model?: string): Promise<Appliance> {
    const api = `/appliances`;
    const data = {
      device: device,
      nickname: nickname,
      image: image,
      model: model
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  reorderAppliances(appliances: string[]): Promise<void> {
    const api = `/appliance_orders`;
    const data = {
      appliances: appliances.join(',')
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  deleteAppliance(appliance: string): Promise<void> {
    const api = `/appliances/${appliance}/delete`;
    return this.httpClient.post(api);
  }

  updateAppliance(appliance: string, nickname: string, image: string): Promise<Appliance> {
    const api = `/appliances/${appliance}`;
    const data = {
      nickname: nickname,
      image: image
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  fetchApplianceSignals(appliance: string): Promise<Signal[]> {
    const api = `/appliances/${appliance}/signals`;
    return this.httpClient.get(api);
  }

  createApplianceSignal(appliance: string, message: InfraredSignal, image: string, name: string): Promise<Signal> {
    const api = `/appliances/${appliance}/signals`;
    const data = {
      message: JSON.stringify(message),
      image: image,
      name: name
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  reorderApplianceSignals(appliance: string, signals: string[]): Promise<void> {
    const api = `/appliances/${appliance}/signal_orders`;
    const data = {
      signals: signals.join(',')
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  updateSignal(signal: string, image: string, name: string): Promise<void> {
    const api = `/signals/${signal}`;
    const data = {
      image: image,
      name: name
    };
    return this.httpClient.post(api, qs.stringify(data));
  }

  deleteSignal(signal: string): Promise<void> {
    const api = `/signals/${signal}/delete`;
    return this.httpClient.post(api);
  }

  sendSignal(signal: string): Promise<void> {
    const api = `/signals/${signal}/send`;
    return this.httpClient.post(api);
  }
}
