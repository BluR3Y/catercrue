import { useState } from "react";
import TextInput from "./TextInput";

export default {
    title: 'Components/TextInput',
    component: TextInput
}

const Template = (args:any) => {
    const [value, setValue] = useState("");
    const [errorText, setErrorText] = useState(args.errorText || "");

    return (
        <TextInput
            {...args}
            inputValue={value}
            inputCallback={(value:any) => {
                setValue(value);
                if (errorText) {
                    setErrorText("");
                }
            }}
            errorText={errorText}
        />
    );
};

export const Primary = Template.bind({}) as any;
Primary.args = {
    labelText: "Hello",
    errorText: "Test Error"
}