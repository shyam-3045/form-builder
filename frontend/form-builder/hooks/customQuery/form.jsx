import { useMutation, useQuery } from "@tanstack/react-query";
import { getMyForms, submitForms } from "../services/form";

export const useForms = (formID) => {
  return useQuery({
    queryKey: ["form", formID],
    queryFn: () => getMyForms(formID),
    enabled: !!formID,
  });
};

export const useSubmitForms = ()=>
{
  return useMutation({
        mutationFn:({ formID, answers })=>
            submitForms(formID,answers),
        onSuccess:()=>
        console.log("success"),
    onError:(error)=>
      console.log(error)

    })
}