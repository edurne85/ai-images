import { type VirtualScrollConfig } from 'react-open-source-grid';

const style: Partial<React.CSSProperties> = {
    flexGrow: 1,
    flexShrink: 1,
};

const virtualScrollConfig: VirtualScrollConfig = {
    enabled: true,
    containerHeight: 800,
    overscanCount: 5, // Extra rows to render above/below viewport
    enableColumnVirtualization: true,
    columnOverscan: 3, // Extra columns to render
};

export { style, virtualScrollConfig };
