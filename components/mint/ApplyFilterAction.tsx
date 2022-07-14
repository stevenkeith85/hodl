import { FC, useEffect } from "react";
import { FilterButtons } from "./FilterButtons";
import { MintProps } from "./models";

export const ApplyFilterAction: FC<MintProps> = ({
  setLoading,
  formData,
  setFormData,
  setStepComplete
}: MintProps) => {

  useEffect(() => {
    setStepComplete(1);
  }, [])

  return (
    <FilterButtons formData={formData} setFormData={setFormData} />
  )
}