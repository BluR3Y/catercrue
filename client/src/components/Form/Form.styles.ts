import styled, { css } from "styled-components";
import { IStyledForm } from "./Form.types";

export const StyledForm = styled.form<IStyledForm>`
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    max-width: 500px;
    width: inherit;
    align-items: center;
    padding: 15px 25px;

    background-color: ${props => props.theme.colors.container};

    .form-name {
        font-size: 2em;
        color: ${props => props.theme.colors.primary}
    }

    .related {
        width: 100%;
        display: flex;
        gap: 2em;
    }

    button {
        margin-top: 20px;
    }
`;