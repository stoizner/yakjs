import {css} from 'lit-element';

export const toggleButtonStyles = css`
    :host {
        --background: var(--switch-button-background-color, #405d6b);
        --height: var(--switch-button-height, 1.5rem);
        --color: var(--switch-button-active-color, #CDDC39);

        display: inline-block;
        position: relative;
        width: calc(2 * var(--height));
        height: var(--height);
        padding: 0;
    }

    * {
        box-sizing: border-box;
    }

    .toggle-button {
        background: var(--background);
        border-radius: calc(var(--height) / 2);
        padding: 2px;
        transition: all .2s ease;
        outline: 0;
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        cursor: pointer;
        user-select: none;
    }

    .toggle-button:after {
        left: 0;
        border-radius: calc(var(--height) / 2);
        background: #ffffff;
        transition: all .2s ease;
        position: relative;
        display: block;
        content: "";
        width: calc(var(--height) - 4px);
        height: calc(var(--height) - 4px);
    }

   .toggle-button[data-is-active] {
        background: var(--color);
    }

    .toggle-button[data-is-active]:after {
        left: var(--height);
    }
`;
