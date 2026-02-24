import React from 'react';
import { createRoot } from 'react-dom/client';
import { WidgetApi } from 'matrix-widget-api';
import { IssueBoardWidget } from './IssueBoardWidget';

const params = new URLSearchParams(window.location.search);
const widgetId = params.get('widgetId') ?? undefined;
const parentUrl = params.get('parentUrl') ?? undefined;

const widgetApi = new WidgetApi(widgetId, parentUrl);

widgetApi.requestCapabilityToReceiveState('eu.kiefte.issue');
widgetApi.requestCapabilityToReceiveState('eu.kiefte.issues.schema');
widgetApi.requestCapabilityToSendState('eu.kiefte.issue');
widgetApi.requestCapabilityToSendState('eu.kiefte.issues.schema');
widgetApi.requestCapabilityToReceiveState('m.room.power_levels');

widgetApi.start();

let rendered = false;

widgetApi.once('ready', () => {
  rendered = true;
  const root = createRoot(document.getElementById('widget-root')!);
  root.render(<IssueBoardWidget widgetApi={widgetApi} />);
});

// Fallback: if not embedded in a Matrix client, show a helpful message
setTimeout(() => {
  if (rendered) return;
  const root = createRoot(document.getElementById('widget-root')!);
  root.render(
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100vh', gap: 16, padding: 24, textAlign: 'center', fontFamily: 'system-ui, sans-serif',
      color: '#444' }}>
      <div style={{ fontSize: 32 }}>📋</div>
      <div style={{ fontWeight: 600, fontSize: 18 }}>Matrix Issue Tracker Widget</div>
      <div style={{ maxWidth: 420, color: '#666', lineHeight: 1.6 }}>
        This widget is designed to be embedded in a Matrix client such as{' '}
        <a href="https://github.com/neilalexander/gomuks" style={{ color: '#1976d2' }}>Gomuks</a> or{' '}
        <a href="https://element.io" style={{ color: '#1976d2' }}>Element Web</a>.
      </div>
      <div style={{ maxWidth: 420, color: '#888', fontSize: 13, lineHeight: 1.6 }}>
        To add it to a room, send an <code>im.vector.modular.widgets</code> state event,
        or use the "Enable widget" button in the{' '}
        <a href="https://codeberg.org/lapingvino/cinny" style={{ color: '#1976d2' }}>cinny fork</a> issue board.
      </div>
    </div>
  );
}, 4000);
