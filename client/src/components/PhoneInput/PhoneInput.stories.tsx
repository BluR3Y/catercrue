import { Meta } from "@storybook/react";
import PhoneInput from "./PhoneInput";

const meta = {
    title: 'Components/PhoneInput',
    component: PhoneInput,
    parameters: {
        layout: 'centered'
    }
} satisfies Meta<typeof PhoneInput>;
export default meta;

export const Primary = {
    args: {
        inputValue: "Hello",
        errorText: "err"
    }
}