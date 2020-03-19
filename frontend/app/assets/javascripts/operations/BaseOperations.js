import Nuxeo from 'nuxeo'
import IntlService from 'views/services/intl'
import URLHelpers from '../common/URLHelpers'
export default class BaseOperations {
  static properties = {
    condition: 'ecm:isTrashed = 0 ',
    client: new Nuxeo({
      baseURL: URLHelpers.getBaseURL(),
      restPath: 'site/api/v1',
      automationPath: 'site/automation',
      timeout: 60000,
    }),
  }

  static initClient() {
    this.properties.client.schemas('*')
  }

  static setClient(client) {
    this.properties.client = client
  }

  static getProperties() {
    return this.properties
  }

  static intl = IntlService.instance
}
