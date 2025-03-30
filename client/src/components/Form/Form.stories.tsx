import { useState } from "react";
import Form from "./Form";
import TextInput from "../TextInput/TextInput";
import { fn } from "@storybook/test";
import { Meta } from "@storybook/react";

const meta = {
    title: 'Components/Form',
    component: Form,
    parameters: {
        layout: 'centered'
    }
} satisfies Meta<typeof Form>;

export default meta;

const Template = (args:any) => {
    const [firstName, setFirstName] = useState("John")
    const [lastName, setLastName] = useState("Doe");
    const [email, setEmail] = useState("johndoe@gmail.com");
    const [errorText, setErrorText] = useState("Email is already taken");

    const handleSubmit = (event:any) => {
        event.preventDefault();
        fn(event)
    }

    return (
        <Form
            onSubmit={handleSubmit}
        >
            <div className="related">
                <TextInput
                    labelText="First Name"
                    inputValue={firstName}
                    inputCallback={setFirstName}
                    errorText="Hehe"
                />
                <TextInput
                    labelText="Last Name"
                    inputValue={lastName}
                    inputCallback={setLastName}
                    errorText="Haha"
                />
            </div>
            <TextInput
                labelText="Email"
                inputValue={email}
                inputCallback={setEmail}
                errorText={errorText}
            />
        </Form>
    )
}
// Last Here - Working on form component
export const Primary = Template.bind({}) as any;
Primary.args = {}