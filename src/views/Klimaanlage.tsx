import { ControlPanel } from '../components/controls/ControlPanel';
import { klimaanlageConfig } from '../config/pages.config';
import { AirConditionerCard } from '../components/devices/AirConditionerCard';
import { useUserConfigStore } from '../store/userConfigStore';
import { mergeControlPanels } from '../config/controlPanelMerger';

export const Klimaanlage = () => {
  const { userControlPanels } = useUserConfigStore();
  const mergedPanels = mergeControlPanels(klimaanlageConfig.controlPanels, userControlPanels);

  return (
    <div className="space-y-6">
      {/* AC Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Büro */}
        <AirConditionerCard
          title="Büro"
          powerStateId="tuya.0.17415888c4d8d5216e63.1"
          modeStateId="tuya.0.17415888c4d8d5216e63.4"
          currentTempStateId="tuya.0.17415888c4d8d5216e63.3"
          targetTempStateId="tuya.0.17415888c4d8d5216e63.2"
          fanSpeedStateId="tuya.0.17415888c4d8d5216e63.5"
          connectionStateId="tuya.0.17415888c4d8d5216e63.online"
          minTemp={16}
          maxTemp={31}
        />

        {/* Wohnzimmer */}
        <AirConditionerCard
          title="Wohnzimmer"
          powerStateId="tuya.0.17415888c4d8d521377a.1"
          modeStateId="tuya.0.17415888c4d8d521377a.4"
          currentTempStateId="tuya.0.17415888c4d8d521377a.3"
          targetTempStateId="tuya.0.17415888c4d8d521377a.2"
          fanSpeedStateId="tuya.0.17415888c4d8d521377a.5"
          connectionStateId="tuya.0.17415888c4d8d521377a.online"
          minTemp={16}
          maxTemp={31}
        />

        {/* Schlafzimmer */}
        <AirConditionerCard
          title="Schlafzimmer"
          powerStateId="tuya.0.1741588824d7ebe39fcb.1"
          modeStateId="tuya.0.1741588824d7ebe39fcb.4"
          currentTempStateId="tuya.0.1741588824d7ebe39fcb.3"
          targetTempStateId="tuya.0.1741588824d7ebe39fcb.2"
          fanSpeedStateId="tuya.0.1741588824d7ebe39fcb.5"
          connectionStateId="tuya.0.1741588824d7ebe39fcb.online"
          minTemp={16}
          maxTemp={26}
        />
      </div>

      {/* Other control panels */}
      {mergedPanels.map((panel, idx) => (
        <ControlPanel key={idx} title={panel.name} states={panel.states} />
      ))}
    </div>
  );
};
