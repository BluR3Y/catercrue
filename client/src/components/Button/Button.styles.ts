import styled, { css } from "styled-components";
import { IStyledButton } from "./Button.types";

export const StyledButton = styled.button<IStyledButton>`
    font-size: 100%;
    min-width: 60px;
    line-height: 1;
    border: 0;
    cursor: pointer;
    border-radius: 3em;
    padding: 8px 18px;
    background-color: ${props => props.theme.colors.primary};
`;