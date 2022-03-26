import store from "store2";
import { StoreName } from "../enums/storeEnums";
import { createProfile, createProject, createTeam, getProfileTeamsProjects, getSurvey, updateSurvey } from "./queries";

const completeUserRegistration = async (user, onItemStarted) => {
  onItemStarted("Building your profile...")
  await checkProfile(user)
  onItemStarted("Checking for files to save...")
  await checkLocalFiles(user)
  onItemStarted("Verifying any surveys...")
  await checkArweaveSurvey(user)
  return true;
}

const checkProfile = async (user) => {
  const userStore = store.namespace("user");
  
  if (!userStore('profile')) {
    let profile = await getProfileTeamsProjects(user.id)

    if (!profile) {
      profile = await createProfile(user)
    }

    if (!profile) {
      return false;
    }

    let team = (profile.teams || [])[0]
    if (!team) {
      team = await createTeam(profile)
    }

    if (!team) {
      return false;
    }

    if ((team.projects || []).length === 0) {
      const project = await createProject(team, { title: `${user.email}'s Project` })
      if (!project) return false;
    }

    userStore('profile', profile)
  }
}

const checkArweaveSurvey = async ({ email }) => {
  const surveyStore = store.namespace("survey");

  if (surveyStore("arweave")?.verified) return;

  const survey = await getSurvey({ email })

  if (survey) {
    if (!survey.verified) {
      survey.verified = true;
      updateSurvey(survey.id, survey)    
    }
    surveyStore('arweave', survey)
  }
}

const checkLocalFiles = async () => {
  const generalUploadStore = store.namespace(StoreName.generalUploader)

  if (generalUploadStore('metadataFiles')) {
    console.log("metadataFiles", generalUploadStore('metadataFiles'))
  }
}

export default completeUserRegistration;