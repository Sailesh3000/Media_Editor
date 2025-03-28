import React, { useCallback } from 'react';
import { Stack, NumberInput, Text } from '@mantine/core';

export function ControlPanel({ mediaState, setMediaState }) {
  const handleWidthChange = useCallback((value) => {
    setMediaState(prev => ({
      ...prev,
      width: Math.max(50, Math.min(2000, value || 50))
    }));
  }, [setMediaState]);

  const handleHeightChange = useCallback((value) => {
    setMediaState(prev => ({
      ...prev,
      height: Math.max(50, Math.min(2000, value || 50))
    }));
  }, [setMediaState]);

  const handleStartTimeChange = useCallback((value) => {
    setMediaState(prev => ({
      ...prev,
      startTime: Math.max(0, value || 0),
      endTime: Math.max(prev.endTime, value || 0)
    }));
  }, [setMediaState]);

  const handleEndTimeChange = useCallback((value) => {
    setMediaState(prev => ({
      ...prev,
      endTime: Math.max(prev.startTime, value || prev.startTime)
    }));
  }, [setMediaState]);

  return (
    <Stack spacing="md" p="md" style={{ minWidth: 200 }}>
      <Text size="lg" weight={500}>Controls</Text>
      
      <NumberInput
        label="Width (px)"
        value={mediaState.width}
        onChange={handleWidthChange}
        min={50}
        max={2000}
        step={1}
        error={mediaState.width < 50 || mediaState.width > 2000 ? 'Width must be between 50 and 2000px' : null}
      />

      <NumberInput
        label="Height (px)"
        value={mediaState.height}
        onChange={handleHeightChange}
        min={50}
        max={2000}
        step={1}
        error={mediaState.height < 50 || mediaState.height > 2000 ? 'Height must be between 50 and 2000px' : null}
      />

      <NumberInput
        label="Start Time (s)"
        value={mediaState.startTime}
        onChange={handleStartTimeChange}
        min={0}
        step={0.1}
        precision={1}
        error={mediaState.startTime < 0 ? 'Start time must be positive' : null}
      />

      <NumberInput
        label="End Time (s)"
        value={mediaState.endTime}
        onChange={handleEndTimeChange}
        min={mediaState.startTime}
        step={0.1}
        precision={1}
        error={mediaState.endTime < mediaState.startTime ? 'End time must be greater than start time' : null}
      />
    </Stack>
  );
}