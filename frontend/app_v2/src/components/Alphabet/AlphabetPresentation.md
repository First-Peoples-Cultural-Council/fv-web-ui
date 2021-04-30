Default styling

```jsx padded
<AlphabetPresentation
  isLoading={false}
  characters={[
    { title: 'v' },
    { title: 'u' },
    { title: 'q' },
    { title: 'w' },
    { title: 'e' },
    { title: 'r' },
    { title: 't' },
    { title: 'y' },
    { title: 'i' },
    { title: 'o' },
    { title: 'p' },
    { title: 'a' },
    { title: "k'" },
    { title: 's' },
    { title: 'd' },
    { title: 'f' },
    { title: 'g' },
    { title: 'h' },
    { title: 'j' },
    { title: 'l' },
    { title: 'z' },
    { title: 'x' },
    { title: 'c' },
  ]}
  language="TestLanguage"
  selectedData={{
    title: "k'",
    uid: 'e1134fc0-e4c4-4684-89d8-fb7ee1bd9bff',
    src: '/nuxeo/nxfile/default/b762405b-f98a-4b04-bbd2-1f710eaca9a0/file:content/En-us-river.ogg.mp3',
    videoSrc: '/url/for/video',
    relatedEntries: [
      {
        uid: '1-2-3',
        title: 'RelatedWord',
        definitions: ['defn1', 'defn2'],
        src:
          'https://dev.firstvoices.com/nuxeo/nxfile/default/15761975-8249-400c-a9e2-4a5357ca7ce9/file:content/sample1.mp3',
        url: '/TestLanguage/word/1-2-3',
      },
      {
        uid: '1-2-3',
        title: 'AnotherRelatedWord',
        definitions: ['defn1', 'defn2'],
        src:
          'https://dev.firstvoices.com/nuxeo/nxfile/default/15761975-8249-400c-a9e2-4a5357ca7ce9/file:content/sample1.mp3',
        url: '/TestLanguage/word/1-2-3',
      },
      {
        uid: '1-2-3',
        title: 'YetAnotherRelatedWord',
        definitions: ['defn1', 'defn2'],
        src:
          'https://dev.firstvoices.com/nuxeo/nxfile/default/15761975-8249-400c-a9e2-4a5357ca7ce9/file:content/sample1.mp3',
        url: '/TestLanguage/word/1-2-3',
      },
    ],
  }}
  links={[
    {
      url: '/url/1',
      title: 'Download Alphabet Pronunciation Guide',
    },
    { url: '/url/2', title: 'Another potential related link' },
  ]}
/>
```
