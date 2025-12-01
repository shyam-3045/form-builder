import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllForms, getMyForms, getResponses, submitForms } from "../services/form";

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

export const useAllForms =()=>
{
  return useQuery({
    queryKey:["allforms"],
    queryFn:()=> getAllForms()
  })
}

export const useResponses = (formID) => {
  return useQuery({
    queryKey: ["responses", formID],
    queryFn: () =>getResponses(formID),
    enabled: !!formID,
  });
};