import { Card } from '../ui/Card';
import {
  SwitchControlItem,
  SliderControlItem,
  TimePickerControlItem,
  DropdownControlItem,
  NumberInputControlItem,
  BlindControlItem,
  ReadOnlyControlItem,
  ButtonControlItem,
} from './ControlItems';
import type { StateConfig } from '../../types/controls';

interface ControlPanelProps {
  title: string;
  states: Record<string, StateConfig>;
}

export const ControlPanel = ({ title, states }: ControlPanelProps) => {
  // Separate slider controls from other controls for different layouts
  const sliderControls: [string, StateConfig][] = [];
  const otherControls: [string, StateConfig][] = [];

  Object.entries(states).forEach(([key, config]) => {
    const element = config.bodyElement || config.actionElement;
    if (element === 'LevelBody' || element === 'BlindLevelAction') {
      sliderControls.push([key, config]);
    } else {
      otherControls.push([key, config]);
    }
  });

  return (
    <Card>
      <h2 className="text-h1 text-text-primary font-bold mb-4">{title}</h2>

      {/* Grid layout for non-slider controls */}
      {otherControls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
          {otherControls.map(([key, config]) => {
            const stateId = config.action || config.state;
            const element = config.bodyElement || config.actionElement;

            switch (element) {
              case 'SwitchAction':
                return (
                  <SwitchControlItem
                    key={key}
                    label={config.label}
                    stateId={stateId}
                    showState={config.showState}
                    unit={config.unit}
                  />
                );

              case 'TimePickerAction':
                return (
                  <TimePickerControlItem
                    key={key}
                    label={config.label}
                    stateId={stateId}
                  />
                );

              case 'DropdownAction':
                return (
                  <DropdownControlItem
                    key={key}
                    label={config.label}
                    stateId={stateId}
                    options={config.properties?.options ?? []}
                    showState={config.showState}
                    displayAs={config.displayAs}
                  />
                );

              case 'InputAction':
                return (
                  <NumberInputControlItem
                    key={key}
                    label={config.label}
                    stateId={stateId}
                    min={config.properties?.min}
                    max={config.properties?.max}
                    step={parseFloat(config.LevelBodyConfig?.step || '1')}
                    unit={config.unit}
                  />
                );

              case 'ButtonAction':
                return (
                  <ButtonControlItem
                    key={key}
                    label={config.label}
                    stateId={stateId}
                  />
                );

              default:
                // If no action element, render as read-only display
                if (!element && config.showState) {
                  return (
                    <ReadOnlyControlItem
                      key={key}
                      label={config.label}
                      stateId={stateId}
                      unit={config.unit}
                      displayAs={config.displayAs}
                    />
                  );
                }
                console.warn(`Unknown control element type: ${element} for ${key}`);
                return null;
            }
          })}
        </div>
      )}

      {/* Full-width layout for slider controls */}
      {sliderControls.length > 0 && (
        <div className="space-y-3">
          {sliderControls.map(([key, config]) => {
            const stateId = config.action || config.state;
            const element = config.bodyElement || config.actionElement;

            if (element === 'LevelBody') {
              return (
                <SliderControlItem
                  key={key}
                  label={config.label}
                  stateId={stateId}
                  min={config.properties?.min ?? 0}
                  max={config.properties?.max ?? 100}
                  step={parseFloat(config.LevelBodyConfig?.step || '1')}
                  unit={config.unit}
                  showState={config.showState}
                />
              );
            }

            if (element === 'BlindLevelAction') {
              return (
                <BlindControlItem
                  key={key}
                  label={config.label}
                  stateId={stateId}
                  inverted={config.inverted}
                />
              );
            }

            return null;
          })}
        </div>
      )}
    </Card>
  );
};
