import { Injectable } from '@angular/core';
import JSEncrypt from 'jsencrypt'

@Injectable({
  providedIn: 'root'
})
export class RsaEncryptionService {

  constructor() { }

  encrypt(data) {
    if (!data)
      return

    const publicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4N93yDV1zdrjZOKXkDDH\neLKypFDe+epsHtKR/j/niB6aS4IF2xWlRUH2lwa/pth5YP/joB3pYQ+ruhEjdd+y\nY0Vnu6WxeaPOla8kO83DBmqcCeEZsBpuYXsdpea44P/Qx50AFXmsMl1nMR7rs+OU\noVb8gTxzjloS6zF+OuueD7XtCbU4trLjECeaGbnEuxZCp4UoxUh3WMAeUvSN+wOA\nFyJsWDJhV/mxFpQu+5nWnDJgUsFsEFHtDlt5sd7KqjWeb42MTwLGwgL3xIc4Zq8r\ndQLA3wGmM/Z/jsb/pZ1D5wWT1O1s6urhl5n4hivGVrX5XsQNA66ZZzSLC6b06o+A\nDwIDAQAB\n-----END PUBLIC KEY-----\n"

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encryptedData = encrypt.encrypt(data);

    return encryptedData;
  }
}
