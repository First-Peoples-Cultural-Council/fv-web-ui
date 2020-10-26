import t from 'tcomb-form'
import ValuedCheckboxFactory from 'common/schemas/customFields/ValuedCheckboxFactory'
import SearchDocumentTypesTemplate from 'components/SearchDocumentTypesTemplate'

import RangeSelector from 'common/schemas/customFields/RangeSelectorFactory'
import dataTestId from 'common/schemas/customFields/DataTestId'
import ProviderHelpers from 'common/ProviderHelpers'
import IntlService from 'common/services/IntlService'

const intl = IntlService.instance

const i18nExt = {
  add: '+ ' + intl.translate({ key: 'add_new', default: 'Add New', case: 'first' }),
  down: '▼',
  remove: 'X',
  up: '▲',
  select: intl.translate({ key: 'select', case: 'first' }),
  optional: '(' + intl.translate({ key: 'optional', default: 'Optional', case: 'first' }) + ')',
}

const ResourcesFields = {
  fields: {
    'properties.dc:title': {
      label: intl.translate({
        key: 'name_description',
        default: 'Name/Description',
        case: 'words',
      }),
      nxql: " (dc:title ILIKE '%${value}%' OR dc:description ILIKE '%${value}%')",
      factory: dataTestId,
    },
    'properties.type': {
      label: intl.translate({
        key: 'resource_type',
        default: 'Resource Type',
        case: 'words',
      }),
      factory: t.form.Select,
      nxql: " ecm:primaryType LIKE '${value}'",
    },
    'common:size': {
      label: intl.translate({
        key: 'models.file_size_greater_than',
        default: 'Greater than (MB)',
        case: 'words',
        append: ' (MB)',
      }),
      nxql: ' common:size > ${value} * 1024 * 1024',
    },
    'picture:info.height': {
      label: intl.translate({
        key: 'models.height_greater_than',
        default: 'Height Greater Than',
        case: 'words',
        append: ':',
      }),
      nxql: ' picture:info/height > ${value}',
      factory: RangeSelector,
    },
    'picture:info.width': {
      label: intl.translate({
        key: 'models.width_greater_than',
        default: 'Width Greater Than',
        case: 'words',
        append: ':',
      }),
      nxql: ' picture:info/width > ${value}',
      factory: RangeSelector,
    },
    'dc:contributors': {
      label: intl.translate({
        key: 'models.my_uploads_contributions',
        default: 'My Uploads/Contributions',
        case: 'words',
      }),
      nxql: " dc:contributors IN ('${value}')",
      // NOTE: ValuedCheckboxFactory could be related to an issue in setting the checkbox via `formValues` prop - see FW-205
      // It triggers an error when the checkbox is clicked
      factory: ValuedCheckboxFactory,
    },
    'fvm:origin': {
      label: intl.translate({
        key: 'models.attached_to_word_phrase',
        default: 'Attached to Word/Phrase',
        case: 'words',
      }),
      nxql: " (fvm:origin IS NOT NULL AND fvm:origin <> '')",
    },
    'fvm:child_focused': {
      label: intl.translate({
        key: 'models.child_focused',
        default: 'Child Focused',
        case: 'words',
      }),
      nxql: ' fvm:child_focused = ${value}',
    },
    'fvm:shared': {
      label: intl.translate({
        key: 'shared',
        default: 'Shared',
        case: 'words',
      }),
      nxql: ' fvm:shared = ${value}',
    },
  },
}

const filterOptions = {
  Default: {
    fields: {
      'properties.dc:title': {
        label: intl.translate({
          key: 'title',
          default: 'Title',
          case: 'words',
        }),
        nxql: " (dc:title ILIKE '%${value}%' OR dc:description ILIKE '%${value}%')",
      },
    },
  },
  Portals: {
    fields: {
      'contextParameters.ancestry.dialect.dc:title': {
        label: intl.translate({
          key: 'models.dialect_name',
          default: 'Dialect Name',
          case: 'words',
        }),
      },
      'contextParameters.portal.roles': {
        label: intl.translate({
          key: 'models.my_roles',
          default: 'My Roles',
          case: 'words',
        }),
        factory: t.form.Select,
        filterFunc: (propertyToSearch, filterValue) => {
          if (!propertyToSearch) return true

          return (
            propertyToSearch.findIndex((value) => {
              if (filterValue == 'Anything') {
                return ProviderHelpers.isActiveRole(value)
              }
              return value.search(new RegExp(filterValue, 'i')) === -1 ? false : true
            }) !== -1
          )
        },
      },
    },
  },
  ResourcesSelector: {
    fields: Object.assign({}, ResourcesFields.fields, {
      shared_fv: {
        label: intl.translate({
          key: 'models.include_shared_from_firstvoices',
          default: 'Include Shared from FirstVoices',
          case: 'words',
        }),
        nxql: " (ecm:path STARTSWITH '/FV/Workspaces/SharedData/Shared Resources/')",
        operator: 'OR',
        //nxqlGroup: 'search_group1'
      },
      shared_dialects: {
        label: intl.translate({
          key: 'models.include_shared_from_other_dialects',
          default: 'Include Shared from Other Dialects',
          case: 'words',
        }),
        nxql: " (fvm:shared = 1 AND ecm:currentLifeCycleState != 'New')",
        operator: 'OR',
        //nxqlGroup: 'search_group1'
      },
    }),
  },
  Resources: ResourcesFields,
  Books: {
    fields: {
      'properties.dc:title': {
        label: intl.translate({
          key: 'title',
          default: 'Title',
          case: 'first',
        }),
      },
      'properties.fvbook:type': {
        label: intl.translate({
          key: 'resource_type',
          default: 'Resource Type',
          case: 'first',
        }),
        factory: t.form.Select,
      },
    },
  },
  User: {
    fields: {
      searchTerm: {
        label: intl.translate({
          key: 'search_term',
          default: 'Search Term',
          case: 'words',
        }),
      },
      group: {
        label: intl.translate({
          key: 'groups',
          default: 'Group(s)',
          case: 'words',
        }),
        help: intl.translate({
          key: 'models.group_identifiers_help',
          default: 'Group identifiers (For example: "sample_dialect_recorders")',
          case: 'first',
        }),
      },
    },
  },
  Reports: {
    fields: {
      name: {
        label: intl.translate({
          key: 'models.report_name',
          default: 'Report Name',
          case: 'words',
        }),
      },
      type: {
        label: intl.translate({
          key: 'models.show_report_on',
          default: 'Show Report On',
          case: 'words',
          append: ': ',
        }),
        factory: t.form.Select,
      },
    },
  },
  Search: {
    fields: {
      searchTerm: {
        label: intl.translate({
          key: 'search_term',
          default: 'Search Term',
          case: 'first',
        }),
        attrs: {
          //autoFocus: true,
        },
      },
      documentTypes: {
        label: intl.trans('document_types', 'Doc Types', 'first'),
        template: SearchDocumentTypesTemplate,
      },
    },
    i18n: i18nExt,
  },
}

export default filterOptions
