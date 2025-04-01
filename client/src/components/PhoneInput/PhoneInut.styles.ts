import styled, { css } from "styled-components";
import { IStyledPhoneInput } from "./PhoneInput.types";
import { StyledTextInput } from "../TextInput";

export const StyledPhoneInput = styled.div<any>`
    display: flex;
    position: relative;
    width: inherit;
    max-width: 500px;   // Optional, for readability
    min-width: 100px;
    margin: 1.4em 0 1.3em 0;
    border-radius: 3px;
    border-width: 2px;
    border-style: solid;
    user-select: none;
    font-size: 100%;

    div:nth-child(1) {
        width: 20px;
    }
`;