'use client';

import React, { useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Loader2 } from 'lucide-react';

interface JitsiRoomProps {
  roomName: string;
  displayName: string;
  userEmail: string;
}

export default function JitsiRoomClient({ roomName, displayName, userEmail }: JitsiRoomProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-[calc(100vh-60px)] relative">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-10">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-400 animate-pulse font-medium">Establishing secure end-to-end peer connection...</p>
        </div>
      )}
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: false,
          disableModeratorIndicator: true,
          prejoinPageEnabled: true,
          requireDisplayName: true,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          HIDE_DEEP_LINKING_LOGO: true,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
        }}
        userInfo={{
          displayName,
          email: userEmail
        }}
        onApiReady={(externalApi) => {
          setLoading(false);
          // Optional: attach any event listeners here if necessary
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
      />
    </div>
  );
}
