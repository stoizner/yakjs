import {css} from 'lit-element';

export const appLayoutStyles = css`
    :host {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .app-header {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 65px;
    }

    .app-body {
        position: absolute;
        top: 64px;
        right: 0;
        bottom: 0;
        left: 0;
    }
`;
