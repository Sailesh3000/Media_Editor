import React, { useState } from 'react';
import { AppShell, Container, Group } from '@mantine/core';
import { MediaCanvas } from './components/MediaCanvas';
import { ControlPanel } from './components/ControlPanel';
import { Timeline } from './components/Timeline';

export default function App() {
  const [mediaState, setMediaState] = useState({
    width: 800,
    height: 600,
    startTime: 0,
    endTime: 0,
    currentTime: 0,
    isPlaying: false,
    media: null
  });

  return (
    <AppShell
      padding="md"
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }
      })}
    >
      <Container size="xl" style={{ flex: 1, display: 'flex' }}>
        <Group spacing="md" style={{ flex: 1 }}>
          <ControlPanel
            mediaState={mediaState}
            setMediaState={setMediaState}
          />
          <MediaCanvas
            mediaState={mediaState}
            setMediaState={setMediaState}
          />
        </Group>
      </Container>
      <Timeline
        mediaState={mediaState}
        setMediaState={setMediaState}
      />
    </AppShell>
  );
}