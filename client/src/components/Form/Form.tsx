import { StyledForm } from "./Form.styles";
import { IForm } from "./Form.types";
import Button from "../Button/Button";
import { useRef } from "react";

export default function({
    children,
    onSubmit
}: IForm) {
    const formRef = useRef(null);
    const handleClick = (event:any) => {
        (formRef as any).current.requestSubmit();
    }

    return(
        <StyledForm
            ref={formRef}
            onSubmit={onSubmit}
        >
            {children}
            <Button
                labelText="Submit"
                onClick={handleClick}
            />
        </StyledForm>
    );
}