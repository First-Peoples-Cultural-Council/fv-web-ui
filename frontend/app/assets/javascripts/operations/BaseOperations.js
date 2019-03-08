import ConfGlobal from "conf/local.json"
import Nuxeo from "nuxeo"
import IntlService from "views/services/intl"

export default class BaseOperations {
  static properties = {
    condition: "ecm:currentLifeCycleState <> 'deleted'",
    client: new Nuxeo({
      baseURL: ConfGlobal.baseURL,
      restPath: "site/api/v1",
      automationPath: "site/automation",
      timeout: 300,
    }),
  }

  static initClient() {
    this.properties.client.header("X-NXproperties", "*")
  }

  static setClient(client) {
    this.properties.client = client
  }

  static intl = IntlService.instance
}
