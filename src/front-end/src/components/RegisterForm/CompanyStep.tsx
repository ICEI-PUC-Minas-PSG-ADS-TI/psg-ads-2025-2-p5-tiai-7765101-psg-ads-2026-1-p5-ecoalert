import { RHFInput } from "@/components/RHFInput/RHFInput";
import { useFormContext } from "react-hook-form";
import { ButtonContainer, ButtonWrapper } from "./style";
import { Button } from "@/components/Button/Button";
import { Fab } from "@/components/Fab/Fab";

export function CompanyStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <RHFInput name="socialName" label="Nome Social" />
      <RHFInput name="instagram" label="Instagram" />

      <ButtonContainer>
        <ButtonWrapper>
          <Button
            onClick={onBack}
            variant="text"
            color="primary"
            shape="square"
            icon="arrow-left"
            type="button"
          />
          <Button type="submit" color="primary" shape="square" icon="check">
            Cadastrar
          </Button>
        </ButtonWrapper>
      </ButtonContainer>
    </>
  );
}
