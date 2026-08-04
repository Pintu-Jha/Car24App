import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SDUIPage, SDUISection } from '@/schema/types';
import { UnknownFallback } from '@/sdui/UnknownFallback';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SDUIListRenderer } from './SDUIListRenderer';
import { SDUITabRenderer } from './SDUITabRenderer';
import { colors } from '@/theme';
interface Props {
  page: SDUIPage;
  registry: Record<string, React.ComponentType<any>>;
  useUnknownPayload?: boolean;
}

const MemoizedSection = React.memo(
  ({ section, registry }: { section: SDUISection; registry: Record<string, React.ComponentType<any>> }) => {
    const Component = registry[section.type];
    if (!Component) return <UnknownFallback section={section} />;

    return (
      <ErrorBoundary fallbackMessage={`Failed to render component: ${section.type}`}>
        <Component {...section.props} data={section.data} action={section.action} />
      </ErrorBoundary>
    );
  },
  (prev, next) => prev.section === next.section || prev.section.id === next.section.id
);

export function SDUIRenderer({ page, registry }: Props) {
  // Split sections to inject Top Tabs organically
  const headerSection = page.sections.find(s => s.type === 'header_search');
  const quicklinksSection = page.sections.find(s => s.type === 'category_quicklinks');
  const contentSections = page.sections.filter(s => s.type !== 'header_search' && s.type !== 'category_quicklinks');

  const HeaderComponent = headerSection ? registry[headerSection.type] || UnknownFallback : null;

  return (
    <View style={styles.container}>
      {HeaderComponent && headerSection && (
        <ErrorBoundary fallbackMessage="Failed to render Header">
          <HeaderComponent
            {...headerSection.props}
            data={headerSection.data}
            action={headerSection.action}
          />
        </ErrorBoundary>
      )}

      {quicklinksSection && quicklinksSection.data ? (
        <SDUITabRenderer 
          quicklinksSection={quicklinksSection} 
          contentSections={contentSections}
          registry={registry}
          renderSection={(s, r) => <MemoizedSection key={s.id} section={s} registry={r} />}
        />
      ) : (
        <SDUIListRenderer 
          sections={contentSections} 
          registry={registry} 
          renderSection={(s, r) => <MemoizedSection key={s.id} section={s} registry={r} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  }
});
