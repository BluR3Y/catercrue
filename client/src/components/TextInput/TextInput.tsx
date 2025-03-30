import { useState } from "react";
import { StyledTextInput } from "./TextInput.styles";
import { ITextInput } from "./TextInput.types";

export default function({
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
            <label htmlFor="input">{labelText}</label>
            <input
                type="text"
                id={labelText}
                name={labelText}
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