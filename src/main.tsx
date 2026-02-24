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

widgetApi.once('ready', () => {
  const root = createRoot(document.getElementById('widget-root')!);
  root.render(<IssueBoardWidget widgetApi={widgetApi} />);
});
