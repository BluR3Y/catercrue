import { StyledPhoneInput } from "./PhoneInut.styles"
import { IPhoneInput } from "./PhoneInput.types";
import { useState } from "react";
import TextInput from "../TextInput/TextInput";

export default function PhoneInput({
    id,
    inputValue,
    inputCallback,
    errorText
}: IPhoneInput) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <StyledPhoneInput
            isFocused={isFocused}
            isEmpty={!inputValue.length}
            isInvalid={!!errorText}
        >
            <TextInput
                inputValue=""
                errorText=""
                inputCallback={() => ''}
                id=""
                labelText=""
            />
            <TextInput
                inputValue=""
                errorText=""
                inputCallback={() => ''}
                id=""
                labelText=""
            />
        </StyledPhoneInput>
    );
}