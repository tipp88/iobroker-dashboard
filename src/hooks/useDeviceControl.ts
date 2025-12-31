import { useMutation, useQueryClient } from '@tanstack/react-query';
import { iobrokerClient } from '../api/iobroker';
import { useDeviceStore } from '../store/deviceStore';

export const useDeviceControl = (deviceId: string) => {
  const queryClient = useQueryClient();
  const updateDeviceState = useDeviceStore((state) => state.updateDeviceState);

  return useMutation({
    mutationFn: (value: any) => iobrokerClient.setState(deviceId, value),
    onMutate: async (newValue) => {
      await queryClient.cancelQueries({ queryKey: ['device', deviceId] });

      const previousValue = queryClient.getQueryData(['device', deviceId]);

      updateDeviceState(deviceId, newValue);
      queryClient.setQueryData(['device', deviceId], newValue);

      return { previousValue };
    },
    onError: (err, _newValue, context) => {
      if (context?.previousValue !== undefined) {
        queryClient.setQueryData(['device', deviceId], context.previousValue);
        updateDeviceState(deviceId, context.previousValue);
      }
      console.error('Failed to update device:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['device', deviceId] });
    },
  });
};
