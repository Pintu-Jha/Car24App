// src/screens/SDUIHomeScreen.tsx
// SDUI-driven home screen.
// Fetches (imports) a JSON payload and renders it via SDUIRenderer.
// Dev toggle swaps between sample-home.json and with-unknown-component.json
// to demonstrate the graceful fallback in the screen recording.

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import sampleHome from '../schema/sample-home.json';
import withUnknown from '../schema/with-unknown-component.json';
import { SDUIPage } from '../schema/types';
import { SDUIRenderer } from '../sdui/SDUIRenderer';
import { markEnd, markStart, printReport } from '../perf/markers';
import { colors } from '../theme';

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
  const [page, setPage] = useState<SDUIPage | null>(null);
  const hasReported = useRef(false);

  useEffect(() => {
    markStart('sdui_total');
    markStart('json_parse');

    // Simulate async JSON fetch with a microtask tick
    Promise.resolve().then(() => {
      markEnd('json_parse');
      markStart('view_build');

      const payload = useUnknownPayload ? PAYLOADS.unknown : PAYLOADS.normal;
      setPage(payload);
    });
  }, [useUnknownPayload]);

  // Report once view has built (after first render with data)
  useEffect(() => {
    if (page && !hasReported.current) {
      markEnd('view_build');
      markEnd('sdui_total');
      printReport();
      hasReported.current = true;
    }
  }, [page]);

  if (!page) {
    return <View style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <SDUIRenderer page={page} />
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
