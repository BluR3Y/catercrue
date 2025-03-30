import styled, { css } from "styled-components";
import { IStyledForm } from "./Form.types";

export const StyledForm = styled.form<IStyledForm>`
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    max-width: 500px;
    align-items: center;
    padding: 0 25px;

    background-color: ${props => props.theme.colors.container};

    .related {
        width: 100%;
        display: flex;
        gap: 2em;
    }
`;