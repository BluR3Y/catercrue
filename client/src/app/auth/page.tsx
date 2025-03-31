'use client';

import Form from "@/components/Form/Form";
import TextInput from "@/components/TextInput/TextInput";
import { useState } from "react";
import { StyledAuth } from "./page.styles";

export default function Auth() {
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("s");

    const handleSubmit = (event:any) => {
        event.preventDefault();
        console.log(event)
    }

    return(
        <StyledAuth>
            <Form
                labelText="Register"
                onSubmit={handleSubmit}
            >
                <TextInput
                    labelText="phone"
                    id="phone"
                    inputValue={phone}
                    inputCallback={setPhone}
                    errorText={phoneError}
                />
            </Form>
        </StyledAuth>
    );
}