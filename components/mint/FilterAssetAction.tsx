import { FC, useEffect } from "react";
import { FilterButtons } from "./FilterButtons";
import { MintProps } from "./models";

interface FilterAssetActionProps {
  formData: any;
  setFormData?: Function;
  setStepComplete?: Function;
};

export const FilterAssetAction: FC<FilterAssetActionProps> = ({
  formData,
  setFormData,
  setStepComplete
}: MintProps) => {

  useEffect(() => {
    setStepComplete(2);
  }, [setStepComplete])

  return (
    <FilterButtons formData={formData} setFormData={setFormData} />
  )
}