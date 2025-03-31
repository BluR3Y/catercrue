'use client';

import { StyledForm } from "./Form.styles";
import { IForm } from "./Form.types";
import Button from "../Button/Button";
import { useRef, MouseEvent } from "react";

export default function({
    children,
    onSubmit,
    labelText
}: IForm) {
    const formRef = useRef(null);
    const handleClick = (event:MouseEvent<HTMLButtonElement>) => {
        (formRef as any).current.requestSubmit();
    }

    return(
        <StyledForm
            ref={formRef}
            onSubmit={onSubmit}
        >
            <h1 className="form-name">{labelText}</h1>
            {children}
            <Button
                labelText="Submit"
                onClick={handleClick}
            />
        </StyledForm>
    );
}