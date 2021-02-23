import React from 'react'
import { render, screen } from '@testing-library/react'
import TopicsPresentationTopic from 'components/Topics/TopicsPresentationTopic'
import AppStateContext from 'qa/jest/AppStateContext'

import {
  WIDGET_LIST_WORD,
  WIDGET_LIST_PHRASE,
  //   WIDGET_LIST_SONG,
  WIDGET_LIST_STORY,
  // WIDGET_LIST_MIXED,
  // WIDGET_LIST_GENERIC,
} from 'common/constants'
// Presentation
describe('TopicsPresentation', () => {
  const heading = 'lorem'
  const suheading = 'ipsum'
  const image = 'imageContet.jpg'
  const audio = 'audio'
  const url = 'url'
  const count = 99

  // WIDGET_LIST_WORD
  // ------------------------------------------
  test('WIDGET_LIST_WORD', () => {
    render(
      <AppStateContext.Provider>
        <TopicsPresentationTopic
          audio={audio}
          heading={heading}
          image={image}
          subheading={suheading}
          url={url}
          type={WIDGET_LIST_WORD}
        />
      </AppStateContext.Provider>
    )

    // Heading
    expect(
      screen.getByText(heading, {
        exact: false,
      })
    ).toBeInTheDocument()

    // Subheading
    expect(
      screen.getByText(suheading, {
        exact: false,
      })
    ).toBeInTheDocument()

    // Icon
    expect(screen.getByTestId('ChatBubble')).toBeInTheDocument()

    // Audio
    expect(
      screen.getByText('Play audio', {
        exact: false,
      })
    ).toBeInTheDocument()

    expect(screen.getByTestId('TopicsPresentationTopic')).toMatchSnapshot()
  })

  // WIDGET_LIST_PHRASE
  // ------------------------------------------
  test('WIDGET_LIST_PHRASE', () => {
    render(
      <AppStateContext.Provider>
        <TopicsPresentationTopic
          heading={heading}
          image={image}
          url={url}
          listCount={count}
          type={WIDGET_LIST_PHRASE}
        />
      </AppStateContext.Provider>
    )

    // Heading
    expect(
      screen.getByText(heading, {
        exact: false,
      })
    ).toBeInTheDocument()

    // Icon
    expect(screen.getByTestId('Quote')).toBeInTheDocument()

    // Count
    expect(
      screen.getByText('99 phrases', {
        exact: false,
      })
    ).toBeInTheDocument()

    expect(screen.getByTestId('TopicsPresentationTopic')).toMatchSnapshot()
  })

  // WIDGET_LIST_STORY
  // ------------------------------------------
  test('WIDGET_LIST_STORY', () => {
    render(
      <AppStateContext.Provider>
        <TopicsPresentationTopic
          heading={heading}
          subheading={suheading}
          image={image}
          url={url}
          type={WIDGET_LIST_STORY}
        />
      </AppStateContext.Provider>
    )

    // Heading
    expect(
      screen.getByText(heading, {
        exact: false,
      })
    ).toBeInTheDocument()

    // Subheading
    expect(
      screen.getByText(suheading, {
        exact: false,
      })
    ).toBeInTheDocument()

    // Icon
    expect(screen.getByTestId('Book')).toBeInTheDocument()

    expect(screen.getByTestId('TopicsPresentationTopic')).toMatchSnapshot()
  })
})
