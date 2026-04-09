import { AlertProps } from "@mui/material";

export interface IFlashMessage {
    open: boolean;
    message: string;
    severity?: AlertProps["severity"];
}

export interface FormStepProps {
    onBack?: () => void;
    onNext?: () => void;
    isLastStep?: boolean;
}