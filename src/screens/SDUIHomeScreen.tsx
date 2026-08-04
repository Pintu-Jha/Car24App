// src/screens/SDUIHomeScreen.tsx
// SDUI-driven home screen.
// Fetches (imports) a JSON payload and renders it via SDUIRenderer.
// Dev toggle swaps between sample-home.json and with-unknown-component.json
// to demonstrate the graceful fallback in the screen recording.

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import sampleHome from '@/schema/sample-home.json';
import withUnknown from '@/schema/with-unknown-component.json';
import { SDUIPage } from '@/schema/types';
import { SDUIRenderer } from '@/sdui/SDUIRenderer';
import { componentRegistry } from '@/sdui/registry';
import { markEnd, markStart, printReport } from '@/perf/markers';
import { colors } from '@/theme';

// In a real app this would be: fetch('/api/home').then(r => r.json())
// For this demo we import locally to keep the build self-contained.
// TTR breakdown still works: markStart before parse, markEnd after.
const PAYLOADS: Record<string, SDUIPage> = {
  normal: sampleHome as unknown as SDUIPage,
  unknown: withUnknown as unknown as SDUIPage,
};

interface Props {
  useUnknownPayload?: boolean;
}

export function SDUIHomeScreen({ useUnknownPayload = false }: Props) {
  const page = useUnknownPayload ? PAYLOADS.unknown : PAYLOADS.normal;
  const hasReported = useRef(false);

  if (!hasReported.current) {
    markStart('sdui_total');
    markStart('json_parse');
    markEnd('json_parse');
    markStart('view_build');
  }

  useEffect(() => {
    if (!hasReported.current) {
      markEnd('view_build');
      markEnd('sdui_total');
      printReport();
      hasReported.current = true;
    }
  }, []);

  return (
    <View style={styles.container}>
      <SDUIRenderer page={page} registry={componentRegistry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
});
