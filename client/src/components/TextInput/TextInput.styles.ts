import styled, { css } from "styled-components";
import { IStyledTextInput } from "./TextInput.types";

export const StyledTextInput = styled.div<IStyledTextInput>`
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    max-width: 500px;   // Optional, for readability
    min-width: 100px;
    margin: 1.4em 0 1.3em 0;
    border-radius: 3px;
    border-width: 2px;
    border-style: solid;
    user-select: none;
    
    ${props => props.isFocused ? css`
        border-color: ${props.theme.colors.secondary};
        background-color: ${props.theme.colors.background};
    ` : css`
        border-color: ${props.isInvalid ? 'red' : props.theme.colors.accent};
        &:hover {
            background-color: ${props.theme.colors.background};
        }
    `}

    label {
        position: absolute;
        pointer-events: none;

        transition-duration: 0.15s;
        color: ${props => props.theme.colors.text};
        ${props => props.isFocused || !props.isEmpty ? css`
            top: -80%;
            opacity: 0.85;
            left: 0;
        ` : css`
            left: 6px;
            opacity: 0.7;
            top: 50%;
            transform: translateY(-50%);
        `}
    }

    input {
        width: inherit;
        height: 25px;
        border: none;
        box-sizing: border-box;
        outline: none;
        padding: 0 6px;
        background: transparent;
        color: ${props => props.theme.colors.text};
        font-size: 1em;
    }

    h1 {
        position: absolute;
        font-size: 0.95em;
        font-weight: normal;
        top: 120%;
        left: 0;
        color: red;
    }
`;