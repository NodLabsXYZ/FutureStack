import store from "store2";
import { StoreName } from "../enums/storeEnums";
import { createAssets, createProfile, createProject, createTeam, getProfileTeamsProjects, getProjects, getSurvey, updateSurvey } from "./queries";

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

  if (generalUploadStore('fileUploads') || generalUploadStore('manifests')) {
    const projects = await getProjects();
    const project = projects[0]

    let assets = []
    if (generalUploadStore('fileUploads')) {
      const arweaveUris = generalUploadStore('fileUploads').split(/,/g)

      for (const arweaveUri of arweaveUris) {
        assets.push({
          info: { arweaveUri }
        })
      }
    }

    const manifests = generalUploadStore('manifests')
    if (manifests) {
      for (const manifestId of Object.keys(manifests)) {
        assets.push({
          info: {
            arweaveManifest: manifestId
          }
        })

        for (const file of manifests[manifestId]) {
          assets.push({
            info: {
              arweaveUri: file.file,
              arweaveMetadata: file.metadata
            }
          })
        }
      }      
    }

    const success = await createAssets(project.id, assets)

    if (success) {
      generalUploadStore('fileUploads', null)
      generalUploadStore('manifests', null)
    }
  }
}

export default completeUserRegistration;