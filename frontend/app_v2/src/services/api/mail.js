import { api } from 'services/config'

const mail = {
  post: async ({ docId, from, message, name, to }) => {
    const params = {
      from,
      message,
      subject: 'FirstVoices Language enquiry from ' + name,
      HTML: 'false',
      rollbackOnError: 'true',
      viewId: 'view_documents',
      bcc: 'hello@firstvoices.com',
      cc: '',
      files: '',
      replyto: from,
      to,
    }
    // TODO: Confirm this path and params when FW-2106 BE is complete and handle success response in UI
    return api.post('nuxeo/site/automation/Document.Mail', { json: { params: params, input: docId } }).json()
  },
}

export default mail
