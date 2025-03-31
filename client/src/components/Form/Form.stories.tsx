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
    const [firstName, setFirstName] = useState(args.firstName)
    const [firstNameError, setFirstNameError] = useState(args.firstNameError);
    const [lastName, setLastName] = useState(args.lastName);
    const [lastNameError, setLastNameError] = useState(args.lastNameError);
    const [email, setEmail] = useState(args.email);
    const [emailError, setEmailError] = useState(args.emailError);

    const handleSubmit = (event:any) => {
        event.preventDefault();
        fn()
    }

    return (
        <Form
            labelText="Register"
            onSubmit={handleSubmit}
        >
            <div className="related">
                <TextInput
                    id="fName"
                    labelText="First Name"
                    inputValue={firstName}
                    inputCallback={setFirstName}
                    errorText={firstNameError}
                />
                <TextInput
                    id="lName"
                    labelText="Last Name"
                    inputValue={lastName}
                    inputCallback={setLastName}
                    errorText={lastNameError}
                />
            </div>
            <TextInput
                id="email"
                labelText="Email"
                inputValue={email}
                inputCallback={setEmail}
                errorText={emailError}
            />
        </Form>
    )
}
// Last Here - Working on form component
export const Primary = Template.bind({}) as any;
Primary.args = {
    firstName: "John",
    firstNameError: "Missing First name",
    lastName: "",
    lastNameError: "",
    email: "",
    emailError: "Missing Email"
}