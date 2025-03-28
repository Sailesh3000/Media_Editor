import React, { useCallback } from 'react';
import { Group, ActionIcon, Text, Slider, Box } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';

export function Timeline({ mediaState, setMediaState }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = useCallback(() => {
    setMediaState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  }, [setMediaState]);

  const handleTimeChange = useCallback((value) => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.currentTime = value;
    }
    setMediaState(prev => ({
      ...prev,
      currentTime: value
    }));
  }, [setMediaState]);

  return (
    <Box
      sx={(theme) => ({
        padding: theme.spacing.md,
        borderTop: `1px solid ${theme.colors.gray[3]}`,
        backgroundColor: theme.white,
        width: '100%'
      })}
    >
      <Group position="apart" align="center" spacing="md" style={{ width: '100%' }}>
        <Group spacing="md" style={{ flex: 1, width: '100%' }}>
          <ActionIcon
            size="lg"
            variant="light"
            onClick={handlePlayPause}
            sx={{ transition: 'transform 0.2s' }}
          >
            {mediaState.isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
          </ActionIcon>

          <Box style={{ flex: 1, width: '100%', minWidth: 0 }}>
            <Slider
              value={mediaState.currentTime}
              onChange={handleTimeChange}
              min={mediaState.startTime}
              max={mediaState.endTime || 100}
              step={0.1}
              label={formatTime}
              sx={{ transition: 'opacity 0.3s' }}
              styles={(theme) => ({
                track: {
                  backgroundColor: theme.colors.gray[2]
                },
                bar: {
                  backgroundColor: theme.colors.blue[6]
                }
              })}
            />
          </Box>

          <Text size="sm" weight={500}>
            {formatTime(mediaState.currentTime)} / {formatTime(mediaState.endTime || 0)}
          </Text>
        </Group>
      </Group>
    </Box>
  );
}