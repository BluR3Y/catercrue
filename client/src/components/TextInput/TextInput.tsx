import { useState } from "react";
import { ITextInput } from "./TextInput.types";
import {
    StyledWrapper,
    StyledLabel,
    StyledInput,
    StyledError
} from "./TextInput.styles";

export default function({
    id,
    labelText,
    inputValue,
    errorText,
    inputCallback
}: ITextInput) {
    const [isFocused, setIsFocused] = useState(false);

    return(
        <StyledWrapper>
            <StyledLabel
                htmlFor={id}
                isEmpty={!inputValue.length}
                isFocused={isFocused}
            >{labelText}</StyledLabel>
            <StyledInput
                id={id}
                name={id}
                type="text"
                value={inputValue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => inputCallback(e.target.value)}
                isInvalid={!!errorText}
            />
            {errorText && (
                <StyledError role="alert">{errorText}</StyledError>
            )}
        </StyledWrapper>
    );
}