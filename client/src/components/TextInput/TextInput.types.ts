
export interface ITextInput {
    labelText: string;
    inputValue: string;
    errorText: string;
    inputCallback: any;
}

export interface IStyledTextInput {
    isFocused: boolean;
    isEmpty: boolean;
    isInvalid: boolean;
}