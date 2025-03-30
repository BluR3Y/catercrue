import { StyledButton } from "./Button.styles";
import { IButton } from "./Button.types";

export default function({
    labelText,
    onClick
}:IButton) {
    return (
        <StyledButton
            onClick={onClick}
        >
            {labelText}
        </StyledButton>
    );
}