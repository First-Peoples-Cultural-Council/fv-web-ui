Setting the different states:

```jsx padded
    <AudioMinimalPresentation
      isErrored={true}
    />
    <AudioMinimalPresentation
      isLoading={true}
    />
    <AudioMinimalPresentation
      isPlaying={true}
    />
```

Overriding the default icons:

```jsx padded
    <AudioMinimalPresentation
      isErrored={true}
      icons={{Error: <div>"Error Icon Overrride"</div>}}
    />
    <AudioMinimalPresentation
      isLoading={true}
      icons={{Play: <div>"Play Icon Overrride"</div>}}
    />
    <AudioMinimalPresentation
      isPlaying={true}
      icons={{Pause: <div>"Pause Icon Overrride"</div>}}
    />
```
