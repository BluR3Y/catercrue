import styled, { css } from "styled-components";
import { IStyledTextInput } from "./TextInput.types";

export const StyledTextInput = styled.div<IStyledTextInput>`
    display: flex;
    flex-direction: column;
    position: relative;
    width: inherit;
    max-width: 500px;
    min-width: 50px;
    font-size: inherit;
    padding-top: 1.4em;

    label {
        position: absolute;
        pointer-events: none;
        transition-duration: 0.15s;
        color: ${props => props.theme.colors.text};
        ${props => props.isFocused || !props.isEmpty ? css`
            top: 0;
            left: 0;
            opacity: 0.85;
            font-size: 1.1em;
        ` : css`
            left: 8px;
            opacity: 0.7;
            top: 2.5em;
            font-size: 100%;
            transform: translateY(-50%);
        `}
    }

    input {
        width: inherit;
        height: 2.2em;
        box-sizing: border-box;
        outline: none;
        border-radius: 3px;
        border-width: 2px;
        padding: 0 8px;
        border-style: solid;
        background-color: transparent;
        font-size: inherit;
        color: ${props => props.theme.colors.text};

        ${props => props.isFocused ? css`
            border-color: ${props.theme.colors.secondary};
            background-color: ${props.theme.colors.background};
        ` : css`
            border-color: ${props.isInvalid ? 'red' : props.theme.colors.accent};
            &:hover {
                background-color: ${props.theme.colors.background};
            }
        `}
    }

    h1 {
        font-size: 0.85em;
        font-weight: normal;
        color: red;
    }
`;
// Last Here