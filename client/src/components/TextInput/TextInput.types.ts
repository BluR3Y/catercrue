
export interface ITextInput {
    id: string;
    labelText: string;
    inputValue: string;
    errorText: string;
    inputCallback: any;
}

export interface IStyledLabel {
    isFocused: boolean;
    isEmpty: boolean;
}

export interface IStyledInput {
    isInvalid: boolean;
}