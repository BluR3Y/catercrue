import styled, { css } from "styled-components";
import { IStyledInput, IStyledLabel } from "./TextInput.types";

export const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    width: inherit;
    max-width: 500px;
    min-width: 100px;
    font-size: inherit;
    padding-top: 1.2rem;
`;

export const StyledLabel = styled.label<IStyledLabel>`
    position: absolute;
    transition: 0.2s ease;
    color: ${props => props.theme.colors.text};
    user-select: none;
    ${props => (props.isFocused || !props.isEmpty) ? css`
        top: 0;
        left: 0;
        opacity: 1;
        font-size: 1rem;
    ` : css`
        left: 8px;
        opacity: 0.7;
        top: 2.3rem;
        font-size: 1.2rem;
        transform: translateY(-50%);
    `}
`;

export const StyledInput = styled.input<IStyledInput>`
    font-size: 1.1rem;
    width: inherit;
    height: 2.2rem;
    padding: 0 8px;
    border: 2px solid ${props => props.isInvalid ? props.theme.colors.error || 'red' : props.theme.colors.accent};
    border-radius: 3px;
    outline: none;
    background-color: transparent;
    color: ${props => props.theme.colors.text};

    &:hover {
        background-color: ${props => props.theme.colors.background};
    }

    &:focus {
        border-color: ${props => props.theme.colors.secondary};
        background-color: ${props => props.theme.colors.background};
    }
`;

export const StyledError = styled.span`
    font-size: 0.85rem;
    font-weight: normal;
    color: ${props => props.theme.colors.error || 'red'};
    margin-top: 0.3rem;
`;