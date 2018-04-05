export interface User {
  id: string;
  nickname: string;
}

export interface DeviceCore {
  id: string;
  name: string;
  temperature_offset: number;
  humidity_offset: number;
  created_at: string;
  updated_at: string;
  firmware_version: string;
}

export interface SensorValue {
  value: number;
  created_at: string;
}

export interface Device extends DeviceCore {
  newest_events: {
    te: SensorValue;
    hu: SensorValue;
  };
}

export interface ApplianceModel {
  id: string;
  manufacturer: string;
  remote_name: string;
  name: string;
  image: string;
}

export interface AirConRangeMode {
  temp: string;
  vol: string;
  dir: string;
}

export interface AirConParams extends AirConRangeMode {
  mode: string;
  button: string;
}

export interface AirCon {
  range: {
    modes: {
      cool: AirConRangeMode,
      warm: AirConRangeMode,
      dry: AirConRangeMode,
      blow: AirConRangeMode,
      auto: AirConRangeMode
    },
    fixedButtons: string[]
  };
  tempUnit: string;
}

export interface Signal{
  id: string;
  name: string;
  image: string;
}

export interface Appliance {
  id: string;
  device: DeviceCore;
  model: ApplianceModel;
  nickname: string;
  image: string;
  type: string;
  settings: AirConParams;
  aircon: AirCon;
  signals: Signal[];
}

export interface ApplianceModelAndParam {
  model: ApplianceModel;
  params: AirConParams;
}

export interface InfraredSignal {
  format: string,
  freq: number,
  data: number[]
}
