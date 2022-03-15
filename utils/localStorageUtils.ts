import store from "store2";
import { StoreName } from "../enums/storeEnums";
import { FileWithPreview } from "../types/FileWithPreview";
import { NftObject } from "../types/NftObject";
import { TempFileData } from "../types/TempData";


export async function addFilesToLocalStorage(files: FileWithPreview[]): Promise<void> {
  const filesUploaderStore = store.namespace(StoreName.filesUploader);

  for (let index = 0; index < files.length; index++) {
    const file = files[index]

    const clientTempFilePath = await getClientTempFilePath(file);

    console.log('clientTempFilePath :>> ', clientTempFilePath)

    const newNftObj: TempFileData = {
      clientTempFilePath,
      fileName: file.name,
    }
    const numberOfItemsToUpload = (index + 1).toString()
    filesUploaderStore(index.toString(), JSON.stringify(newNftObj))
    filesUploaderStore('numberOfItemsToUpload', numberOfItemsToUpload)
  }
}


export async function addNftObjsToLocalStorage(nftObjs: NftObject[]): Promise<void> {
  const nftUploaderStore = store.namespace(StoreName.nftUploader);

  for (let index = 0; index < nftObjs.length; index++) {
    const nftObj = nftObjs[index]

    const clientTempFilePath = await getClientTempFilePath(nftObj.imageFile);

    const newNftObj = {
      clientTempFilePath,
      imageFileName: nftObj.imageFile.name,
      metadata: nftObj.metadata
    }
    const numberOfItemsToUpload = (index + 1).toString()
    nftUploaderStore(index.toString(), JSON.stringify(newNftObj))
    nftUploaderStore('numberOfItemsToUpload', numberOfItemsToUpload)
  }
}

const getClientTempFilePath = async (file: FileWithPreview): Promise<string> => {
  const formData = new FormData()

  formData.append('file', file)

  const options = {
    method: 'POST',
    body: formData
  }

  const response = await fetch('/api/uploader/getTempFilePath', options)

  const { clientTempFilePath } = await response.json()
  return clientTempFilePath;
}