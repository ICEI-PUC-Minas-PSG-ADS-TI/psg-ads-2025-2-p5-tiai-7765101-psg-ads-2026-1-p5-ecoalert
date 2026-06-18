import { RHFInput } from "@/components/RHFInput/RHFInput";
import { useFormContext } from "react-hook-form";
import { ButtonContainer, ButtonWrapper } from "./style";
import { Button } from "@/components/Button/Button";
import { fetchAddressByCep } from "@/services/viacep.service";
import { maskCep } from "@/utils/formatter";

interface AddressStepProps {
  onNext: () => void;
  onBack: () => void;
  isLastStep?: boolean;
}

export function AddressStep({ onNext, onBack, isLastStep }: AddressStepProps) {
  const { setValue, trigger } = useFormContext();

  async function handleFetchAddress(cep: string) {
    if (cep.length !== 8) return;

    try {
      const address = await fetchAddressByCep(cep);
      setValue("address.street", address.street);
      setValue("address.neighborhood", address.neighborhood);
      setValue("address.city", address.city);
      setValue("address.state", address.state);

      await trigger("address");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <RHFInput
        name="address.cep"
        label="CEP"
        onBlur={handleFetchAddress}
        mask={maskCep}
      />
      <RHFInput name="address.street" label="Rua" />
      <RHFInput name="address.neighborhood" label="Bairro" />
      <RHFInput name="address.city" label="Cidade" />
      <RHFInput name="address.state" label="Estado" />
      <RHFInput name="address.number" label="Número" />

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
          {isLastStep ? (
            <Button type="submit" color="primary" shape="square" icon="check">
              Cadastrar
            </Button>
          ) : (
            <Button
              onClick={onNext}
              color="primary"
              shape="square"
              icon="arrow-right"
              type="button"
            >
              Próximo
            </Button>
          )}
        </ButtonWrapper>
      </ButtonContainer>
    </>
  );
}
