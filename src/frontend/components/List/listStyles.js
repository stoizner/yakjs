import {css} from 'lit-element';

export const listStyles = css`
    :host {
    }

    ol {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    li {
        position: relative;
        display: flex;
        justify-content: left;
        align-items: center;
        box-sizing: border-box;
        height: 3rem;
        padding: 0 1rem;
        line-height: 3rem;
        border-bottom: solid 1px #e0e0e0;
    }

    li > * {
        margin-right: 1rem;
    }
`;
