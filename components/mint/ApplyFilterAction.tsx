import { FC, useEffect } from "react";
import { FilterButtons } from "./FilterButtons";
import { MintProps } from "./models";

interface ApplyFilterActionProps {
  formData: any;
  setFormData?: Function;
  setStepComplete?: Function;
};

export const ApplyFilterAction: FC<ApplyFilterActionProps> = ({
  formData,
  setFormData,
  setStepComplete
}: MintProps) => {

  useEffect(() => {
    setStepComplete(1);
  }, [setStepComplete])

  return (
    <FilterButtons formData={formData} setFormData={setFormData} />
  )
}