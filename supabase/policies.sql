CREATE POLICY profile_contract_access 
ON public.contract
WITH CHECK (
  auth.uid() IN ( 
    SELECT profile.user_id 
    FROM profile, "_profileToteam", project 
    WHERE (
      (
        (profile.id = "_profileToteam"."A") 
        AND ("_profileToteam"."B" = project.team_id) 
        AND (project.id = contract.project_id)
      ) OR (
        contract.public = true
      )
    )
  )
)

CREATE POLICY profile_project_access
ON public.project
WITH CHECK (
  auth.uid() IN ( 
    SELECT profile.user_id 
    FROM profile, "_profileToteam" 
    WHERE (
      (profile.id = "_profileToteam"."A") 
      AND ("_profileToteam"."B" = project.team_id)
    )
  )
)