import React from 'react'
import t from 'tcomb-form'

import classNames from 'classnames'

import VirtualKeyboardFactory from 'common/schemas/customFields/VirtualKeyboardFactory'
import dataTestId from 'common/schemas/customFields/DataTestId'

import WysiwygFactory from 'common/schemas/customFields/WysiwygFactory'
import SelectSuggestFactory from 'common/schemas/customFields/SelectSuggestFactory'
import SelectFactory from 'common/schemas/customFields/SelectFactory'
import MediaFactory from 'common/schemas/customFields/MediaFactory'

import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import ArrowForward from '@material-ui/icons/ArrowForward'
import ArrowBack from '@material-ui/icons/ArrowBack'
import FVButton from 'components/FVButton'
import IntlService from 'common/services/IntlService'
import ProviderHelpers from 'common/ProviderHelpers'

const intl = IntlService.instance

const i18nExt = {
  add: '+ ' + intl.trans('add_new', 'Add New', 'first'),
  down: '▼',
  remove: 'X',
  up: '▲',
  optional: '(' + intl.trans('optional', 'Optional', 'first') + ')',
}

window.intl = IntlService.instance

// const configExt = {
//   config: {
//     // for each of lg md sm xs you can specify the columns width
//     horizontal: {
//       md: [3, 9],
//       sm: [6, 6],
//     },
//   },
// }

const FVPortalTemplate = function template(locals) {
  return (
    <fieldset>
      <div className="col-md-12">{locals.inputs['fv-portal:greeting']}</div>
      <div className="col-md-12">{locals.inputs['fv-portal:about']}</div>
      <div className="col-md-12">{locals.inputs['fv-portal:news']}</div>
      <div className="col-md-12">{locals.inputs['fv-portal:featured_words']}</div>
      <div className="col-md-12">{locals.inputs['fv-portal:related_links']}</div>
      <div className="col-md-12">{locals.inputs['fv-portal:featured_audio']}</div>
      <div className="col-md-6">{locals.inputs['fv-portal:background_top_image']}</div>
      <div className="col-md-6">{locals.inputs['fv-portal:logo']}</div>
    </fieldset>
  )
}

const FVUserRegistrationTemplate = function template(locals) {
  let selectedCommunityLanguageLabel = null

  locals.onChange = new (function setSelectedCommunityLanguageLabel() {
    const requestedSpaceElement = document.getElementById('registration-requested-space')

    if (requestedSpaceElement !== null) {
      const selectBox = requestedSpaceElement.getElementsByTagName('select')[0]

      if (selectBox.selectedIndex !== 0) {
        selectedCommunityLanguageLabel = selectBox.options[selectBox.selectedIndex].innerHTML
        document.getElementById('language_team_member_name').innerHTML = document.getElementById(
          'community_member_name'
        ).innerHTML = selectedCommunityLanguageLabel
      }
    }
  })()

  return (
    <div>
      <fieldset>
        <div className="col-md-6">{locals.inputs['userinfo:firstName']}</div>
        <div className="col-md-6">{locals.inputs['userinfo:lastName']}</div>
        <div className="col-md-6">{locals.inputs['userinfo:email']}</div>
        <div className="col-md-6">{locals.inputs['fvuserinfo:role']}</div>
        <div className="col-md-6">{locals.inputs['fvuserinfo:ageGroup']}</div>
        <div className="col-md-6" id="registration-requested-space">
          {locals.inputs['fvuserinfo:requestedSpace']}
        </div>

        <div className={classNames('col-md-12', { hidden: !selectedCommunityLanguageLabel })}>
          {locals.inputs['fvuserinfo:community_member']}
        </div>
        <div className={classNames('col-md-12', { hidden: !selectedCommunityLanguageLabel })}>
          {locals.inputs['fvuserinfo:language_team_member']}
        </div>

        <div className="col-md-12">{locals.inputs['fvuserinfo:comment']}</div>
      </fieldset>
    </div>
  )
}

const DefinitionsLayout = (locals) => (
  <div className="table-responsive">
    <table className="table">
      <tbody>
        <tr>
          <td>{locals.inputs.language}</td>
          <td>{locals.inputs.translation}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

const RelatedMediaLayout = (locals) => (
  <div className="row" style={{ margin: '15px 0' }}>
    <fieldset>
      <legend>
        {locals.label}{' '}
        <FVButton
          style={{
            border: '1px solid rgb(204, 204, 204)',
            borderRadius: '4px',
            fontSize: '1.4rem',
            color: 'rgb(51, 51, 51)',
            textTransform: 'none',
          }}
          onClick={locals.add.click}
        >
          {locals.add.label}
        </FVButton>
      </legend>
      {(locals.items || []).map((item, i) => (
        <div key={i} className={classNames('col-xs-12', 'col-md-3')}>
          {item.input}
          <div
            style={{
              textAlign: 'center',
              marginTop: '-15px',
              backgroundColor: 'rgba(234, 234, 234, 0.6)',
              borderRadius: '0 0 10px 10px',
            }}
          >
            {item.buttons.map((button, j) => {
              let icon = ''
              let label = ''
              let testId = ''

              switch (button.type) {
                case 'remove':
                  testId = 'IconButton__remove'
                  icon = <Clear />
                  label = intl.trans('remove_item', 'Remove Item', 'first')
                  break

                case 'move-up':
                  testId = 'IconButton__move-up'
                  icon = <ArrowBack />
                  label = intl.trans('move_left', 'Move left (appears first)', 'first')
                  break

                case 'move-down':
                  testId = 'IconButton__move-down'
                  icon = <ArrowForward />
                  label = intl.trans('move_right', 'Move right', 'first')
                  break
                default: // Note: do nothing
              }

              return (
                <IconButton
                  data-testid={testId}
                  tooltip={label}
                  // iconClassName="material-icons"
                  key={j}
                  onClick={button.click}
                  style={{ verticalAlign: '-8px' }}
                >
                  {icon}
                </IconButton>
              )
            })}
          </div>
        </div>
      ))}
    </fieldset>
  </div>
)

const SingleRelatedMediaLayout = (locals) => {
  const { label, add, items } = locals
  const hasItems = items.length !== 0
  const item = hasItems ? items[0] : null
  const button = item ? item.buttons.find((b) => b.type === 'remove') : null
  return (
    <div className="row" style={{ margin: '15px 0' }}>
      <fieldset>
        <legend>
          {label}{' '}
          <FVButton
            style={{
              border: '1px solid rgb(204, 204, 204)',
              borderRadius: '4px',
              fontSize: '1.4rem',
              color: 'rgb(51, 51, 51)',
              textTransform: 'none',
              opacity: hasItems ? '0.5' : '1',
            }}
            onClick={add.click}
            disabled={hasItems}
          >
            {add.label}
          </FVButton>
        </legend>
        {item && (
          <div style={{ display: 'flex' }}>
            <div style={{ flexGrow: 1, maxWidth: 'calc(100% - 50px)' }}>{item.input}</div>
            <div
              style={{
                textAlign: 'center',
                marginBottom: '15px',
                backgroundColor: 'rgba(234, 234, 234, 0.6)',
                borderRadius: '0 10px 10px 0',
              }}
            >
              <IconButton
                data-testid={'IconButton__remove'}
                tooltip={intl.trans('remove_item', 'Remove Item', 'first')}
                // iconClassName="material-icons"
                onClick={button.click}
                style={{ verticalAlign: '-8px' }}
              >
                <Clear />
              </IconButton>
            </div>
          </div>
        )}
      </fieldset>
    </div>
  )
}

t.String.getValidationErrorMessage = (value, path, context) => {
  if (!value) {
    let text = ''
    if (context && context.options && context.options.label) {
      text = context.options.label
    }
    return intl.translate({
      key: 'models.value_in_field_x_cannot_be_empty',
      params: [text.replace(' *', '')],
      default: 'Value in field "' + text + '" cannot be empty.',
      case: 'first',
    })
  }

  return ''
}

const FVMedia = {
  order: ['dc:title', 'dc:description', 'file', 'fvm:shared', 'fvm:child_focused', 'fvm:source', 'fvm:recorder'],
  fields: {
    'dc:title': {
      label: intl.trans('name', 'Name', 'first'),
      type: 'text',
    },
    'dc:description': {
      label: intl.trans('description', 'Description', 'first'),
      type: 'textarea',
    },
    file: {
      label: intl.trans('file', 'File', 'first'),
      type: 'file',
    },
    'fvm:shared': {
      label: intl.trans('models.shared_across_dialects', 'Shared Across Dialects?', 'first'),
    },
    'fvm:child_focused': {
      label: intl.trans('models.child_focused', 'Child Focused', 'first'),
    },
    'fvm:source': {
      label: `${intl.trans('source', 'Source', 'first')}`,
      item: {
        factory: SelectSuggestFactory,
        type: 'FVContributor',
      },
    },
    'fvm:recorder': {
      label: intl.trans('recorder', 'Recorder', 'first'),
      item: {
        factory: SelectSuggestFactory,
        type: 'FVContributor',
      },
    },
  },
  config: {
    horizontal: {
      md: [3, 9],
      sm: [6, 6],
    },
  },
  i18n: i18nExt,
}

const options = {
  FVWord: {
    order: [
      'dc:title',
      'fv-word:part_of_speech',
      'fv-word:pronunciation',
      'fv:definitions',
      'fv:literal_translation',
      'fv:related_audio',
      'fv:related_pictures',
      'fv:related_videos',
      'fv-word:related_phrases',
      'fv:related_assets',
      'fv-word:categories',
      'fv:cultural_note',
      'fv:reference',
      'fv-word:acknowledgement',
      'fv:source',
      'fv:general_note',
      'fv:available_in_childrens_archive',
      'fv-word:available_in_games',
    ],
    fields: {
      'dc:title': {
        label: intl.trans('word', 'Word', 'first'),
        factory: VirtualKeyboardFactory,
      },
      'fv:general_note': {
        label: intl.trans('generalNote', 'General Notes', 'word'),
        type: 'textarea',
        factory: WysiwygFactory,
        attrs: {
          dataTestId: 'wysiwyg-general_note',
        },
      },
      'fv:definitions': {
        label: intl.trans('definitions', 'Definitions', 'first'),
        item: {
          fields: {
            translation: {
              label: intl.trans('translation', 'Translation', 'first'),
              factory: dataTestId,
            },
            language: {
              label: intl.trans('language', 'Language', 'first'),
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language',
                fancy: false,
              },
            },
          },
          template: DefinitionsLayout,
        },
        help: (
          <i>{intl.trans('models.describe_what_the_word_means', 'Describe what the word actually means.', 'first')}</i>
        ),
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_definition', 'Add definition', 'first')}`,
        },
      },
      'fv:literal_translation': {
        label: intl.trans('literal_translation', 'Literal Translation', 'first'),
        item: {
          fields: {
            translation: {
              label: intl.trans('translation', 'Translation', 'first'),
              factory: VirtualKeyboardFactory,
            },
            language: {
              label: intl.trans('language', 'Language', 'first'),
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language',
              },
            },
          },
          template: DefinitionsLayout,
        },
        help: (
          <i>
            {intl.trans(
              'models.describe_what_the_word_translates_to',
              'Describe what the word translates to regardless of context.',
              'first'
            )}
          </i>
        ),
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_literal_translation', 'Add literal translation', 'first')}`,
        },
      },
      'fv-word:part_of_speech': {
        label: intl.trans('views.pages.search.part_of_speech', 'Part of Speech', 'first'),
        factory: SelectFactory,
        nullOption: { value: '', text: 'Choose the part of speech:' },
        attrs: {
          directory: 'parts_of_speech',
          fancy: false,
          placeholder: true,
        },
      },
      'fv-word:pronunciation': {
        label: intl.trans('pronunciation', 'Pronunciation', 'first'),
        factory: VirtualKeyboardFactory,
      },
      'fv-word:related_phrases': {
        label: intl.trans('views.pages.explore.dialect.learn.words.related_phrases', 'Related Phrases', 'first'),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVPhrase',
          locals: {
            labelBrowseComponent: intl.trans('phrases_browse', 'Browse phrases', 'first'),
          },
        },
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_related_phrases', 'Add related phrases', 'first')}`,
        },
      },

      'fv:related_assets': {
        label: intl.trans('related_assets', 'Related Words', 'first'),
        item: {
          factory: SelectSuggestFactory,
          // When change from Related Words -> Related Assets change type to be all FVCore Documents
          type: 'FVWord',
          attrs: {
            disableCreateNewButton: true,
            previewProps: {
              minimal: true,
            },
          },
        },
        i18n: {
          ...i18nExt,
          // When change from Related Words -> Related Assets change label here
          add: `+ ${intl.trans('add_related_asset', 'Add related word', 'first')}`,
        },
      },
      'fv-word:categories': {
        label: intl.trans('categories', 'Categories', 'first'),
        help: (
          <i>
            {intl.trans(
              'models.category_list_link',
              'Categories for your archive can be added and edited from your language homepage',
              'first'
            )}
            .
          </i>
        ),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVCategory',
          attrs: {
            containerType: 'FVWord',
            allowEdit: false,
            page_provider: {
              name: 'category_suggestion',
              folder: 'Categories',
            },
            hideCreate: true,
          },
          locals: {
            labelBrowseComponent: intl.trans('categories_browse', 'Browse categories', 'first'),
          },
        },
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_categories', 'Add categories', 'first')}`,
        },
      },
      'fv:related_audio': {
        label: intl.trans('related_audio', 'Related Audio', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVAudio',
          locals: {
            labelAddMediaComponent: intl.trans('audio_upload', 'Upload audio', 'first'),
            labelSelectMediaComponent: intl.trans('audio_browse', 'Browse audio', 'first'),
          },
        },
        template: RelatedMediaLayout,
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_related_audio', 'Add related audio', 'first')}`,
        },
      },
      'fv:related_pictures': {
        label: intl.trans('related_pictures', 'Related Pictures', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVPicture',
          locals: {
            labelAddMediaComponent: intl.trans('picture_upload', 'Upload picture', 'first'),
            labelSelectMediaComponent: intl.trans('pictures_browse', 'Browse pictures', 'first'),
          },
        },
        template: RelatedMediaLayout,
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_related_pictures', 'Add related pictures', 'first')}`,
        },
      },
      'fv:related_videos': {
        label: intl.trans('related_videos', 'Related Videos', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVVideo',
          locals: {
            labelAddMediaComponent: intl.trans('video_upload', 'Upload video', 'first'),
            labelSelectMediaComponent: intl.trans('videos_browse', 'Browse videos', 'first'),
          },
        },
        template: RelatedMediaLayout,
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_related_videos', 'Add related videos', 'first')}`,
        },
      },
      'fv:cultural_note': {
        label: intl.trans('views.pages.explore.dialect.learn.words.cultural_note', 'Cultural Note', 'first'),
        item: {
          factory: VirtualKeyboardFactory,
          type: 'FVVideo',
        },
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_cultural_note', 'Add cultural note', 'first')}`,
        },
      },
      'fv:reference': {
        label: intl.trans('reference', 'Reference', 'first'),
        help: <i>{intl.trans('models.origin_of_record', 'Origin of record (person, book, etc)', 'first')}.</i>,
        factory: VirtualKeyboardFactory,
      },
      'fv-word:acknowledgement': {
        label: intl.trans('acknowledgement', 'Acknowledgement', 'first'),
        help: <i>{intl.trans('models.acknowledgement', 'Acknowledgement or Data Usage', 'first')}.</i>,
        factory: VirtualKeyboardFactory,
      },
      'fv:source': {
        label: intl.trans('source', 'Source', 'first'),
        help: (
          <i>
            {intl.trans('models.contributors_who_helped', 'Contributor(s) who helped create this record', 'first')}.
          </i>
        ),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor',
          attrs: {
            allowEdit: true,
          },
          locals: {
            labelBrowseComponent: intl.trans('contributors_browse', 'Browse contributors', 'first'),
          },
        },
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_source', 'Add source', 'first')}`,
        },
      },
      'fv:available_in_childrens_archive': {
        label: intl.trans('models.available_in_childrens_archive', "Available in Children's Archive", 'first'),
      },
      'fv-word:available_in_games': {
        label: intl.trans('models.available_in_games', 'Available in games', 'first'),
      },
    },
    i18n: i18nExt,
  },
  FVPhrase: {
    order: [
      'dc:title',
      'fv:definitions',
      'fv-phrase:phrase_books',
      'fv:related_audio',
      'fv:related_pictures',
      'fv:related_videos',
      'fv:cultural_note',
      'fv:reference',
      'fv-phrase:acknowledgement',
      'fv:source',
      'fv:general_note',
      'fv:available_in_childrens_archive',
    ],
    fields: {
      'fv:general_note': {
        label: intl.trans('generalNote', 'General Notes', 'word'),
        type: 'textarea',
        factory: WysiwygFactory,
        attrs: {
          dataTestId: 'wysiwyg-general_note',
        },
      },
      'dc:title': {
        label: intl.trans('phrase', 'Phrase', 'first'),
      },
      'fv:definitions': {
        label: intl.trans('definitions', 'Definitions', 'first'),
        item: {
          fields: {
            translation: {
              label: intl.trans('translation', 'Translation', 'first'),
            },
            language: {
              label: intl.trans('language', 'Language', 'first'),
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language',
                fancy: false,
              },
            },
          },
          template: DefinitionsLayout,
        },
        help: (
          <i>
            {intl.trans('models.describe_what_the_phrase_means', 'Describe what the phrase actually means.', 'first')}
          </i>
        ),
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_definition', 'Add definition', 'first')}`,
        },
      },
      'fv-phrase:phrase_books': {
        label: intl.trans('phrase_books', 'Phrase Books', 'first'),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVCategory',
          attrs: {
            containerType: 'FVPhrase',
            allowEdit: true,
            page_provider: {
              name: 'phrasebook_suggestion',
              folder: 'Phrase Books',
            },
          },
        },
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('phrase_add_book', 'Add phrase book', 'first')}`,
        },
      },
      'fv:related_audio': {
        label: intl.trans('related_audio', 'Related Audio', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVAudio',
          locals: {
            labelAddMediaComponent: intl.trans('audio_upload', 'Upload audio', 'first'),
            labelSelectMediaComponent: intl.trans('audio_browse', 'Browse audio', 'first'),
          },
        },
        template: RelatedMediaLayout,
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_related_audio', 'Add related audio', 'first')}`,
        },
      },
      'fv:related_pictures': {
        label: intl.trans('related_pictures', 'Related Pictures', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVPicture',
          locals: {
            labelAddMediaComponent: intl.trans('picture_upload', 'Upload picture', 'first'),
            labelSelectMediaComponent: intl.trans('pictures_browse', 'Browse pictures', 'first'),
          },
        },
        template: RelatedMediaLayout,
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_related_pictures', 'Add related pictures', 'first')}`,
        },
      },
      'fv:related_videos': {
        label: intl.trans('related_videos', 'Related Videos', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVVideo',
          locals: {
            labelAddMediaComponent: intl.trans('video_upload', 'Upload video', 'first'),
            labelSelectMediaComponent: intl.trans('videos_browse', 'Browse videos', 'first'),
          },
        },
        template: RelatedMediaLayout,
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_related_videos', 'Add related videos', 'first')}`,
        },
      },
      'fv:cultural_note': {
        label: intl.trans('views.pages.explore.dialect.learn.words.cultural_notes', 'Cultural Notes', 'first'),
        item: {
          factory: VirtualKeyboardFactory,
        },
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_cultural_note', 'Add cultural note', 'first')}`,
        },
      },
      'fv:reference': {
        label: intl.trans('reference', 'Reference', 'first'),
        help: <i>{intl.trans('models.origin_of_record', 'Origin of record (person, book, etc)', 'first')}</i>,
      },
      'fv-phrase:acknowledgement': {
        label: intl.trans('acknowledgement', 'Acknowledgement', 'first'),
        help: <i>{intl.trans('models.acknowledgement', 'Acknowledgement or Data Usage', 'first')}</i>,
      },
      'fv:source': {
        label: intl.trans('source', 'Source', 'first'),
        help: (
          <i>
            {intl.trans('models.contributors_who_helped', 'Contributor(s) who helped create this record.', 'first')}
          </i>
        ),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor',
          locals: {
            labelBrowseComponent: intl.trans('contributors_browse', 'Browse contributors', 'first'),
          },
        },
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_source', 'Add source', 'first')}`,
        },
      },
      'fv:available_in_childrens_archive': {
        label: intl.trans('models.available_in_childrens_archive', "Available in Children's Archive", 'first'),
      },
    },
    i18n: i18nExt,
  },
  FVBook: {
    order: [
      'dc:title',
      'fvbook:title_literal_translation',
      'fvbook:introduction',
      'fvbook:introduction_literal_translation',
      'fvbook:type',
      'fv:related_audio',
      'fv:related_pictures',
      'fv:related_videos',
      'fvbook:author',
      'fv:cultural_note',
      'fv:source',
      'fv:available_in_childrens_archive',
    ],
    fields: {
      'dc:title': {
        label: intl.trans('book_title', 'Book Title', 'first'),
        help: <i>{intl.trans('models.title_of_book', 'The title of the book', 'first')}</i>,
      },
      'fvbook:title_literal_translation': {
        label: intl.trans('models.book_title_translation', 'Book Title Translation', 'first'),
        item: {
          fields: {
            translation: {
              label: intl.trans('translation', 'Translation', 'first'),
            },
            language: {
              label: intl.trans('language', 'Language', 'first'),
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language',
              },
            },
          },
          template: DefinitionsLayout,
        },
        help: (
          <i>
            {intl.trans(
              'models.describe_what_the_title_translates_to',
              'Describe what the title translates to regardless of context.',
              'first'
            )}
          </i>
        ),
      },
      'fvbook:introduction': {
        label: intl.trans('models.book_introduction', 'Book Introduction', 'first'),
        type: 'textarea',
        factory: WysiwygFactory,
        attrs: {
          placeholder: intl.trans('models.enter_book_introduction', 'Enter Book Introduction Here', 'first'),
          dataTestId: 'wysiwyg-fvbook_introduction',
        },
      },
      'fvbook:introduction_literal_translation': {
        label: intl.trans('models.introduction_translation', 'Introduction Translation', 'first'),
        item: {
          fields: {
            translation: {
              label: intl.trans('translation', 'Translation', 'first'),
              type: 'textarea',
              factory: WysiwygFactory,
              attrs: {
                dataTestId: 'wysiwyg-fvbook_introduction_linteral_translation',
              },
            },
            language: {
              label: intl.trans('language', 'Language', 'first'),
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language',
              },
            },
          },
          template: DefinitionsLayout,
        },
        help: (
          <i>
            {intl.trans(
              'models.describe_what_the_introduction_translates_to',
              'Describe what the introduction translates to regardless of context.',
              'first'
            )}
          </i>
        ),
      },
      'fvbook:type': {
        label: intl.trans('type', 'Type', 'first'),
        factory: SelectFactory,
        attrs: {
          directory: 'fv_book_type',
        },
      },
      'fv:related_audio': {
        label: intl.trans('related_audio', 'Related Audio', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVAudio',
        },
      },
      'fv:related_pictures': {
        label: intl.trans('related_pictures', 'Related Pictures', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVPicture',
        },
      },
      'fv:related_videos': {
        label: intl.trans('related_videos', 'Related Videos', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVVideo',
        },
      },
      'fvbook:author': {
        label: intl.trans('author', 'Author', 'first'),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor',
        },
      },
      'fv:source': {
        label: intl.trans('source', 'Source', 'first'),
        help: (
          <i>
            {intl.trans('models.contributors_who_helped', 'Contributor(s) who helped create this record.', 'first')}
          </i>
        ),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor',
        },
      },
      'fv:cultural_note': {
        label: intl.trans('views.pages.explore.dialect.learn.words.cultural_notes', 'Cultural Notes', 'first'),
      },
      'fv:available_in_childrens_archive': {
        label: intl.trans('models.available_in_childrens_archive', "Available in Children's Archive", 'first'),
      },
    },
    i18n: i18nExt,
  },
  FVBookEntry: {
    order: [
      'dc:title',
      'fvbookentry:dominant_language_text',
      'fv:literal_translation',
      'fv:related_audio',
      'fv:related_pictures',
      'fv:related_videos',
      'fv:cultural_note',
      'fv:source',
    ],
    fields: {
      'dc:title': {
        label: intl.trans('models.page_content', 'Page Content', 'first'),
        type: 'textarea',
        factory: WysiwygFactory,

        attrs: {
          dataTestId: 'wysiwyg-dc_title',
        },
      },
      'fvbookentry:dominant_language_text': {
        label: 'Dominant Language Text',
        item: {
          fields: {
            translation: {
              label: intl.trans('translation', 'Translation', 'first'),
              type: 'textarea',
              factory: WysiwygFactory,
            },
            language: {
              label: intl.trans('language', 'Language', 'first'),
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language',
              },
            },
          },
          template: DefinitionsLayout,
        },
        help: <i>{intl.trans('models.page_content_translation', 'Page content translation.', 'first')}</i>,
      },
      'fv:literal_translation': {
        label: 'Literal Translation',
        item: {
          fields: {
            translation: {
              label: intl.trans('translation', 'Translation', 'first'),
              type: 'textarea',
              factory: WysiwygFactory,
            },
            language: {
              label: intl.trans('language', 'Language', 'first'),
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language',
              },
            },
          },
          template: DefinitionsLayout,
        },
        help: (
          <i>
            {intl.trans(
              'models.page_content_translation',
              'Describe what the book entry translates to regardless of context.',
              'first'
            )}
          </i>
        ),
      },
      'fv:related_audio': {
        label: intl.trans('related_audio', 'Related Audio', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVAudio',
        },
      },
      'fv:related_pictures': {
        label: intl.trans('related_pictures', 'Related Pictures', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVPicture',
        },
      },
      'fv:related_videos': {
        label: intl.trans('related_videos', 'Related Videos', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVVideo',
        },
      },
      'fv:source': {
        label: intl.trans('source', 'Source', 'first'),
        help: (
          <i>
            {intl.trans('models.contributors_who_helped', 'Contributor(s) who helped create this record.', 'first')}
          </i>
        ),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor',
        },
      },
      'fv:cultural_note': {
        label: intl.trans('views.pages.explore.dialect.learn.words.cultural_notes', 'Cultural Notes', 'first'),
      },
    },
    i18n: i18nExt,
  },
  FVGallery: {
    order: ['dc:title', 'dc:description', 'fv:related_pictures'],
    fields: {
      'dc:title': {
        label: intl.trans('models.gallery_name', 'Gallery Name', 'first'),
        help: <i>{intl.trans('models.name_of_gallery', 'The Name of the Gallery', 'first')}</i>,
      },

      'dc:description': {
        label: intl.trans('models.gallery_description', 'Gallery Description', 'first'),
        type: 'textarea',
        attrs: {
          placeholder: intl.trans('models.enter_gallery_description', 'Enter gallery description here', 'first'),
        },
      },
      'fv:related_pictures': {
        label: intl.trans('related_pictures', 'Related Pictures', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVPicture',
        },
      },
    },
    i18n: i18nExt,
  },

  FVCategory: {
    order: ['dc:title', 'dc:description', 'fvcategory:parent_category', 'fvcategory:image'],
    fields: {
      'dc:title': {
        label: intl.trans('models.category_name', 'Category Name', 'first'),
        help: <i>{intl.trans('models.name_of_category', 'The name of the category', 'first')}</i>,
      },

      'dc:description': {
        label: intl.trans('models.category_description', 'Category Description', 'first'),
        type: 'textarea',
        attrs: {
          placeholder: intl.trans('models.enter_category_description', 'Enter category description here', 'first'),
        },
      },
      'fvcategory:parent_category': {
        label: intl.trans('models.parent_category_name', 'Parent Category Name', 'first'),
        help: <i>{intl.trans('models.name_of_parent_category', 'The name of the parent category', 'first')}</i>,
        factory: SelectSuggestFactory,
        type: 'FVCategory',
        attrs: {
          containerType: 'FVWord',
          page_provider: {
            name: 'category_suggestion',
            folder: 'Categories',
          },
          disableCreateNewButton: true,
        },
      },
      'fvcategory:image': {
        label: intl.trans('models.category_image', 'Category Image', 'first'),
        factory: MediaFactory,
        type: 'FVPicture',
      },
    },
    i18n: i18nExt,
  },

  FVPhraseBook: {
    order: ['dc:title', 'dc:description'],
    fields: {
      'dc:title': {
        label: intl.trans('models.phrase_book_name', 'Phrase Book Name', 'first'),
        help: <i>{intl.trans('models.name_of_phrase_book', 'The name of the phrase book', 'first')}</i>,
      },

      'dc:description': {
        label: intl.trans('models.phrase_book_description', 'Phrase Book Description', 'first'),
        type: 'textarea',
        attrs: {
          placeholder: intl.trans(
            'models.enter_phrase_book_description',
            'Enter phrase book description here',
            'first'
          ),
        },
      },
    },
    i18n: i18nExt,
  },

  FVContributor: {
    order: ['dc:title', 'dc:description'],
    fields: {
      'dc:title': {
        label: intl.trans('models.contributor_name', 'Contributor Name', 'first'),
        // help: <i>{intl.trans('models.name_of_contributor', 'The name of the contributor', 'first')}</i>,
      },

      'dc:description': {
        label: intl.trans('models.contributor_description', 'Contributor Description', 'first'),
        type: 'textarea',
        attrs: {
          placeholder: intl.trans(
            'models.enter_contributor_description',
            'Enter contributor description here',
            'first'
          ),
        },
      },
    },
    i18n: i18nExt,
  },

  FVPortal: {
    fields: {
      'fv-portal:greeting': {
        label: intl.trans('models.portal_greeting', 'Portal Greeting', 'first'),
      },
      'fv-portal:featured_audio': {
        label: intl.trans('models.greeting_audio', 'Greeting Audio', 'first'),
        factory: MediaFactory,
        type: 'FVAudio',
      },
      'fv-portal:about': {
        label: intl.trans('models.portal_introduction', 'Portal Introduction', 'first'),
        type: 'textarea',
        factory: WysiwygFactory,
        attrs: {
          dataTestId: 'wysiwyg-fv-portal_about',
          idAlt: 'fv-portal_about',
          nameAlt: 'fv-portal:about',
          placeholder: intl.trans('models.enter_portal_description', 'Enter portal description here', 'first'),
        },
      },
      'fv-portal:news': {
        label: intl.trans('news', 'News', 'first'),
        type: 'textarea',
        factory: WysiwygFactory,
        help: intl.trans('models.news_tip', 'Tip: Use * to start a bullet list!', 'first'),
        attrs: {
          dataTestId: 'wysiwyg-fv-portal_news',
        },
      },
      'fv-portal:background_top_image': {
        label: intl.trans('models.background_image', 'Background Image', 'first'),
        factory: MediaFactory,
        type: 'FVPicture',
      },
      'fv-portal:logo': {
        label: intl.trans('logo', 'Logo', 'first'),
        factory: MediaFactory,
        type: 'FVPicture',
      },
      'fv-portal:featured_words': {
        label: intl.trans('featured_words', 'Featured Words', 'first'),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVWord',
          attrs: {
            disableCreateNewButton: true,
            previewProps: {
              minimal: true,
            },
          },
        },
      },
      'fv-portal:related_links': {
        label: intl.trans('related_links', 'Related Links', 'first'),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVLink',
          attrs: {
            previewProps: {
              minimal: true,
            },
            allowEdit: true,
          },
        },
      },
    },
    template: FVPortalTemplate,
    i18n: i18nExt,
  },

  FVDialect: {
    fields: {
      'dc:title': {
        label: intl.trans('models.dialect_name', 'Dialect Name', 'first'),
        type: 'text',
      },
      'dc:description': {
        label: intl.trans('models.about_dialect', 'About Dialect', 'first'),
        type: 'textarea',
        factory: WysiwygFactory,
        attrs: {
          dataTestId: 'wysiwyg-dc_description',
        },
      },
      'fvdialect:about_our_language': {
        label: intl.trans('models.about_dialect', 'About Dialect', 'first'),
        type: 'textarea',
        factory: WysiwygFactory,
        attrs: {
          dataTestId: 'wysiwyg-dc_description',
        },
      },
      'fvdialect:country': {
        label: intl.trans('country', 'Country', 'first'),
        factory: SelectFactory,
        attrs: {
          fancy: false,
          directory: 'fv_countries',
        },
      },
      'fvdialect:dominant_language': {
        label: intl.trans('models.dominant_language', 'Dominant Language', 'first'),
        factory: SelectFactory,
        attrs: {
          fancy: false,
          directory: 'fv_language',
        },
      },
      'fvdialect:region': {
        label: intl.trans('region', 'Region', 'first'),
        type: 'text',
      },
      'fvdialect:keyboards': {
        label: intl.trans('models.keyboard_links', 'Keyboard Links', 'first'),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVLink',
          attrs: {
            previewProps: {
              minimal: true,
            },
            allowEdit: true,
          },
        },
      },
      'fvdialect:language_resources': {
        label: intl.trans('language_resources', 'Language Resources', 'first'),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVLink',
          attrs: {
            previewProps: {
              minimal: true,
            },
            allowEdit: true,
          },
        },
      },
      'fvdialect:contact_information': {
        label: intl.trans('contact_info', 'Contact Information', 'first'),
        type: 'textarea',
        factory: WysiwygFactory,
        attrs: {
          dataTestId: 'wysiwyg-fvdialect_contact_information',
        },
      },
    },
    i18n: i18nExt,
  },

  FVCharacter: {
    fields: {
      'dc:title': {
        label: intl.trans('character', 'Character', 'first'),
        disabled: true,
      },
      'fvcharacter:upper_case_character': {
        label: intl.trans('uppercase', 'Uppercase', 'first'),
        disabled: true,
      },
      'fvcharacter:alphabet_order': {
        label: intl.trans('models.sort_order', 'Sort Order', 'first'),
        disabled: true,
      },
      'fv:related_audio': {
        label: intl.trans('related_audio', 'Related Audio', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVAudio',
        },
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_audio', 'Add Audio', 'first')}`,
          remove: <span data-testid="removeAudio">X</span>,
        },
      },
      'fvcharacter:related_words': {
        label: intl.trans('featured_words', 'Featured Words', 'first'),
        item: {
          factory: SelectSuggestFactory,
          type: 'FVWord',
          attrs: {
            disableCreateNewButton: true,
          },
        },
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_words', 'Add Words', 'first')}`,
        },
      },
      'fv:related_videos': {
        label: intl.trans('related_video', 'Related Video', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVVideo',
        },
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_video', 'Add Video', 'first')}`,
          remove: <span data-testid="removeVideo">X</span>,
        },
      },
    },
    i18n: i18nExt,
  },
  FVAudio: Object.assign({}, FVMedia),
  FVPicture: Object.assign({}, FVMedia),
  FVVideo: Object.assign({}, FVMedia),
  FVResource: FVMedia,
  FVUser: {
    fields: {
      'userinfo:firstName': {
        label: intl.trans('first_name', 'First Name', 'first') + ' *',
        error: 'Please provide your first name.',
      },
      'userinfo:lastName': {
        label: intl.trans('last_name', 'Last Name', 'first') + ' *',
        error: 'Please provide your last name.',
      },
      'userinfo:email': {
        label: intl.trans('views.pages.explore.dialect.users.email_address', 'Email Address', 'first') + ' *',
        error: 'Please provide your email.',
      },
      'fvuserinfo:ageGroup': {
        label: 'Age Group',
      },
      'fvuserinfo:requestedSpace': {
        label:
          intl.translate({
            key: 'models.dialect_to_join',
            default: 'Your FirstVoices community/language',
          }) + ' *',
        factory: SelectFactory,
        attrs: {
          // query:
          //   "SELECT ecm:uuid, dc:title FROM FVDialect WHERE ecm:isTrashed = 0 AND ecm:isLatestVersion = 1 ORDER BY dc:title ASC",
          queryId: 'dialect_titles_uids',
          query: 'dialect_list',
          label: 'Your FirstVoices community/language',
          fancy: false,
        },
        error:
          'Please choose a community portal/language to join. If you are not a member of a community, please skip registration and go straight to the "EXPLORE LANGUAGES" page',
      },
      'fvuserinfo:role': {
        label: 'Why are you interested in FirstVoices?' + ' *',
        factory: t.form.Select,
        nullOption: { value: '', text: 'Choose the main reason:' },
        options: ProviderHelpers.userRegistrationRoles,
        error: "Please let us know or pick the 'other' option.",
      },
      'fvuserinfo:comment': {
        label: 'Other Comments',
        type: 'textarea',
      },
      'fvuserinfo:community_member': {
        label: (
          <span>
            I am a member of the <strong id="community_member_name" /> community.
          </span>
        ),
      },
      'fvuserinfo:language_team_member': {
        label: (
          <span>
            I am an authorized member of the <strong id="language_team_member_name" /> language team
          </span>
        ),
      },
    },
    template: FVUserRegistrationTemplate,
  },
  FVLink: {
    fields: {
      'dc:title': {
        label: intl.trans('title', 'Title', 'first'),
      },
      'dc:description': {
        label: intl.trans('description', 'Description', 'first'),
      },
      'fvlink:url': {
        label: intl.trans('url', 'URL', 'first'),
        help: intl.trans(
          'models.specify_url_if_linking',
          'Specify URL if linking to external or internal links.',
          'first'
        ),
      } /*,
      'file:content': {
        label: 'File',
        help: 'Optional: For linking directly to a file.',
        type: 'file'
      },*/,
    },
  },
  FVLabel: {
    order: ['fv:related_audio'],
    fields: {
      'fv:related_audio': {
        label: intl.trans('related_audio', 'Related Audio', 'first'),
        item: {
          factory: MediaFactory,
          type: 'FVAudio',
          locals: {
            labelAddMediaComponent: intl.trans('audio_upload', 'Upload audio', 'first'),
            labelSelectMediaComponent: intl.trans('audio_browse', 'Browse audio', 'first'),
          },
        },
        template: SingleRelatedMediaLayout,
        i18n: {
          ...i18nExt,
          add: `+ ${intl.trans('add_related_audio', 'Add related audio', 'first')}`,
        },
      },
    },
    i18nExt: i18nExt,
  },
}

export default options
