'use client';

import React, { useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Loader2 } from 'lucide-react';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { useLanguage } from '@/lib/LanguageContext';

interface JitsiRoomProps {
  roomName: string;
  displayName: string;
  userEmail: string;
}

export default function JitsiRoomClient({ roomName, displayName, userEmail }: JitsiRoomProps) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const copy = localizeTreeFromMemory({
    connecting: 'Establishing secure end-to-end peer connection.',
  } as const, lang);

  return (
    <div className="w-full h-[calc(100vh-60px)] relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface text-foreground">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
          <p className="animate-pulse font-medium text-muted-foreground">{copy.connecting}</p>
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
