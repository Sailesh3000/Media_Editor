import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Paper, Text, Group, Button } from '@mantine/core';
import Draggable from 'react-draggable';

export function MediaCanvas({ mediaState, setMediaState }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = mediaState.startTime;
    }
  }, [mediaState.startTime]);

  useEffect(() => {
    if (!videoRef.current || !mediaState.media) return;

    if (mediaState.isPlaying) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Video playback error:", error);
          setMediaState(prev => ({ ...prev, isPlaying: false }));
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [mediaState.isPlaying, mediaState.media, setMediaState]);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragStop = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrag = useCallback((e, data) => {
    setPosition({ x: data.x, y: data.y });
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const validVideoTypes = ['video/mp4', 'video/webm'];
      
      if ([...validImageTypes, ...validVideoTypes].includes(file.type)) {
        const url = URL.createObjectURL(file);
        setMediaState(prev => ({
          ...prev,
          media: {
            type: file.type.startsWith('image/') ? 'image' : 'video',
            url,
            file
          }
        }));
      }
    }
  }, [setMediaState]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFileInputChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const validVideoTypes = ['video/mp4', 'video/webm'];
      
      if ([...validImageTypes, ...validVideoTypes].includes(file.type)) {
        const url = URL.createObjectURL(file);
        setMediaState(prev => ({
          ...prev,
          media: {
            type: file.type.startsWith('image/') ? 'image' : 'video',
            url,
            file
          }
        }));
      }
    }
  }, [setMediaState]);

  const fileInputRef = useRef(null);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Paper
      shadow="sm"
      p="md"
      style={{
        width: mediaState.width,
        height: mediaState.height,
        position: 'relative',
        overflow: 'hidden'
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {!mediaState.media ? (
        <Group
          position="center"
          style={{
            height: '100%',
            flexDirection: 'column',
            opacity: 0.5
          }}
        >
          <Text size="xl">Drag and drop media here</Text>
          <Text size="sm">Supported formats: JPG, PNG, WEBP, MP4, WEBM</Text>
          <Button 
            onClick={handleUploadClick} 
            variant="outline" 
            mt="md"
          >
            Upload Media
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          />
        </Group>
      ) : (
        <Draggable
          position={position}
          onStart={handleDragStart}
          onStop={handleDragStop}
          onDrag={handleDrag}
        >
          {mediaState.media.type === 'image' ? (
            <img
              src={mediaState.media.url}
              alt="Uploaded media"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            />
          ) : (
            <video
              ref={videoRef}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  const currentTime = videoRef.current.currentTime;
                  if (currentTime >= mediaState.endTime) {
                    videoRef.current.currentTime = mediaState.startTime;
                    setMediaState(prev => ({
                      ...prev,
                      currentTime: mediaState.startTime,
                      isPlaying: false
                    }));
                  } else {
                    setMediaState(prev => ({ ...prev, currentTime }));
                  }
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setMediaState(prev => ({
                    ...prev,
                    endTime: prev.endTime || videoRef.current.duration
                  }));
                }
              }}
              src={mediaState.media.url}
              controls={false}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            />
          )}
        </Draggable>
      )}
    </Paper>
  );
}