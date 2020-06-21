import {css} from 'lit-element';

export const headerStyles = css`
    :host {
        position: relative;
        height: 65px;
        overflow: hidden;
        display: flex;
        width: 100%;
        background-color: var(--header-background-color);
    }

    .logo svg {
        width: 250px;
        height: 65px;
     }
`;
