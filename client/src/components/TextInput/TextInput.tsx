import { useState } from "react";
import { StyledTextInput } from "./TextInput.styles";
import { ITextInput } from "./TextInput.types";

export default function({
    id,
    labelText,
    inputValue,
    errorText,
    inputCallback
}: ITextInput) {
    const [isFocused, setIsFocused] = useState(false);

    return(
        <StyledTextInput
            isFocused={isFocused}
            isEmpty={!inputValue.length}
            isInvalid={!!errorText}
        >
            <label htmlFor={id}>{labelText}</label>
            <input
                type="text"
                id={id}
                name={id}
                value={inputValue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(event) => inputCallback(event.target.value)}
            />
            { errorText && (
                <h1>{errorText}</h1>
            ) }
        </StyledTextInput>
    );
}