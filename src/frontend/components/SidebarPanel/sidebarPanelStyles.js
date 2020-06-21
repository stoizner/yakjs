import {css} from 'lit-element';

export const sidebarPanelStyles = css`
    :host {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: grid;
        grid-template-columns: var(--sidebar-panel-width, 400px) auto
    }

    .sidebar {
        grid-column-start: 1;
    }

    .body {
        grid-column-start: 2;
    }
`;
