import { useQuery } from '@tanstack/react-query';
import { iobrokerClient } from '../api/iobroker';
import { API_CONFIG } from '../config/api.config';
import { useDeviceStore } from '../store/deviceStore';
import { useEffect } from 'react';

export const useDeviceState = (deviceId: string, enabled: boolean = true) => {
  const updateDeviceState = useDeviceStore((state) => state.updateDeviceState);

  const query = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => iobrokerClient.getState(deviceId),
    refetchInterval: API_CONFIG.pollingInterval,
    enabled: enabled && !!deviceId,
    retry: 2,
  });

  useEffect(() => {
    if (query.data !== undefined) {
      updateDeviceState(deviceId, query.data);
    }
  }, [query.data, deviceId, updateDeviceState]);

  return query;
};

export const useBulkDeviceStates = (deviceIds: string[], enabled: boolean = true) => {
  const setDeviceStates = useDeviceStore((state) => state.setDeviceStates);

  const query = useQuery({
    queryKey: ['devices', 'bulk', ...deviceIds],
    queryFn: () => iobrokerClient.getBulkStates(deviceIds),
    refetchInterval: API_CONFIG.pollingInterval,
    enabled: enabled && deviceIds.length > 0,
    retry: 2,
  });

  useEffect(() => {
    if (query.data) {
      setDeviceStates(query.data);
    }
  }, [query.data, setDeviceStates]);

  return query;
};
