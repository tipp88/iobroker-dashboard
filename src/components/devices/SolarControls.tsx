import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useDeviceState } from '../../hooks/useDeviceState';
import { useDeviceControl } from '../../hooks/useDeviceControl';
import { Card } from '../ui/Card';
import { Toggle } from '../ui/Toggle';
import { Slider } from '../ui/Slider';
import { BatteryStatus } from './BatteryStatus';
import { useColorScheme } from '../../contexts/ColorSchemeContext';

interface SwitchControlItemProps {
  label: string;
  stateId: string;
}

const SwitchControlItem = ({ label, stateId }: SwitchControlItemProps) => {
  const { data, isLoading } = useDeviceState(stateId);
  const { mutate: setState, isPending } = useDeviceControl(stateId);

  const isOn = Boolean(data);

  const handleToggle = (checked: boolean) => {
    setState(checked);
  };

  return (
    <div className="p-4 rounded-2xl bg-neutral-surface1/80 hover:bg-neutral-surface2/80 transition-colors flex flex-col gap-3 border border-white/10">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        isOn ? 'bg-green-500/20' : 'bg-neutral-surface2'
      }`}>
        <svg
          className={`w-6 h-6 ${isOn ? 'text-green-500' : 'text-text-secondary'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-body text-text-primary font-semibold">{label}</p>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-caption text-text-secondary">{isOn ? 'On' : 'Off'}</span>
        <Toggle
          checked={isOn}
          onChange={handleToggle}
          disabled={isPending || isLoading}
        />
      </div>
    </div>
  );
};

interface SliderControlItemProps {
  label: string;
  stateId: string;
  min: number;
  max: number;
  step?: number;
  unit: string;
}

const SliderControlItem = ({ label, stateId, min, max, step = 1, unit }: SliderControlItemProps) => {
  const { data } = useDeviceState(stateId);
  const { mutate: setValue } = useDeviceControl(stateId);
  const { scheme } = useColorScheme();
  const [localValue, setLocalValue] = useState<number>(min);

  useEffect(() => {
    if (data !== undefined) {
      setLocalValue(Number(data));
    }
  }, [data]);

  const handleChange = (value: number) => {
    setLocalValue(value);
  };

  const handleChangeComplete = (value: number) => {
    setValue(value);
  };

  return (
    <div className="p-4 rounded-lg bg-neutral-surface1/80 hover:bg-neutral-surface2/80 transition-all border border-white/10">
      <p className="text-body text-text-primary font-medium mb-3">{label}</p>
      <Slider
        value={localValue}
        onChange={handleChange}
        onChangeComplete={handleChangeComplete}
        min={min}
        max={max}
        step={step}
        showValue
        unit={unit}
      />
      <div className="flex justify-center mt-3">
        <p className="text-h2 font-bold" style={{ color: scheme.primary }}>
          {localValue} {unit}
        </p>
      </div>
    </div>
  );
};

interface TimePickerControlItemProps {
  label: string;
  stateId: string;
}

const TimePickerControlItem = ({ label, stateId }: TimePickerControlItemProps) => {
  const { data, isLoading } = useDeviceState(stateId);
  const { mutate: setValue, isPending } = useDeviceControl(stateId);
  const [localTime, setLocalTime] = useState<string>('00:00');

  useEffect(() => {
    if (data !== undefined) {
      const timeStr = String(data);
      if (timeStr.includes(':')) {
        setLocalTime(timeStr);
      } else {
        setLocalTime('00:00');
      }
    }
  }, [data]);

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setLocalTime(newTime);
    setValue(newTime);
  };

  return (
    <div className="p-4 rounded-2xl bg-neutral-surface1/80 hover:bg-neutral-surface2/80 transition-colors flex flex-col gap-3 border border-white/10">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20">
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-body text-text-primary font-semibold">{label}</p>
        <input
          type="time"
          value={localTime}
          onChange={handleTimeChange}
          disabled={isPending || isLoading}
          className="px-3 py-2 rounded-lg bg-neutral-surface2 border border-stroke-default text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export const SolarControls = () => {
  return (
    <Card className="space-y-6">
      <h2 className="text-h1 text-text-primary font-bold">Solar Battery Controls</h2>

      {/* Battery Status */}
      <BatteryStatus
        stateId="modbus.2.holdingRegisters.1.40354_ChaSt"
        batteryLevelStateId="fronius.0.storage.0.StateOfCharge_Relative"
      />

      <div className="border-t border-stroke-subtle"></div>

      {/* Switch Controls Section */}
      <div>
        <h3 className="text-h2 text-text-primary font-semibold mb-4">
          Battery Control Switches
        </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SwitchControlItem
              label="EnWG 14a Modul 3 HT-Brücke"
              stateId="0_userdata.0.PV.Akku_Control.14aEnWG_Steuerung.HT_Battery_Bridge"
            />
            <SwitchControlItem
              label="KI-Nacht-Ladung"
              stateId="0_userdata.0.PV.Akku_Control.Nacht-Ladung"
            />
            <SwitchControlItem
              label="Ladeleistung Begrenzen"
              stateId="0_userdata.0.PV.Akku_Control.LadeleistungBegrenzen"
            />
            <SwitchControlItem
              label="Netzdienlicher Betrieb"
              stateId="0_userdata.0.PV.Akku_Control.NetzdienlichesLaden.aktiv"
            />
            <SwitchControlItem
              label="Akku Netzdienlichkeit Automatik"
              stateId="0_userdata.0.PV.Akku_Control.NetzdienlichesLaden.Automatik"
            />
            <TimePickerControlItem
              label="Voll laden ab"
              stateId="0_userdata.0.PV.Akku_Control.NetzdienlichesLaden.bis"
            />
            <SwitchControlItem
              label="Akku Sperrautomatik Wallbox"
              stateId="0_userdata.0.PV.Akku_Control.Automatik_Akku_Sperre"
            />
            <SwitchControlItem
              label="Akku Sperre"
              stateId="0_userdata.0.PV.Akku_Control.Akku_Sperre_Wallbox"
            />
            <SwitchControlItem
              label="Normalbetrieb"
              stateId="0_userdata.0.PV.Akku_Control.Normalbetrieb"
            />
            <SwitchControlItem
              label="Zwangsladung"
              stateId="0_userdata.0.PV.Akku_Control.Zwangsladung"
            />
            <SwitchControlItem
              label="Zwangsentladung"
              stateId="0_userdata.0.PV.Akku_Control.Zwangsentladung"
            />
          </div>
        </div>

      <div className="border-t border-stroke-subtle"></div>

      {/* Slider Controls Section */}
      <div>
        <h3 className="text-h2 text-text-primary font-semibold mb-4">
          Battery Limits & Forecasts
        </h3>

        <div className="space-y-4">
          <SliderControlItem
            label="Netzdienlich Sun Forecast Limit"
            stateId="0_userdata.0.PV.Akku_Control.NetzdienlichesLaden.ForecastLimitSun"
            min={0}
            max={12}
            step={1}
            unit="Hours"
          />
          <SliderControlItem
            label="Netzdienlich PV Forecast"
            stateId="0_userdata.0.PV.Akku_Control.NetzdienlichesLaden.ForcastLimit"
            min={0}
            max={50}
            step={1}
            unit="kWh"
          />
          <SliderControlItem
            label="Akku max SoC"
            stateId="0_userdata.0.PV.Akku_Control.NetzdienlichesLaden.Akku_SoC_max"
            min={0}
            max={100}
            step={1}
            unit="%"
          />
          <SliderControlItem
            label="Akku min SoC"
            stateId="0_userdata.0.PV.Akku_Control.NetzdienlichesLaden.Akku_SoC_min"
            min={0}
            max={100}
            step={1}
            unit="%"
          />
        </div>
      </div>
    </Card>
  );
};
