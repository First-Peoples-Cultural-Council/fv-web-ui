Variant center (with & without image):

```jsx
<HeroPresentation
variant="WIDGET_HERO_CENTER"
background="https://dev.firstvoices.com/nuxeo/nxfile/default/51ac02d0-27c3-44c6-8674-b13699369cd5/picture:views/2/content/Medium_TestPhoto.jpg"
foreground={<h1 className="font-bold text-5xl">"foreground"</h1>}
foregroundIcon={<div>"foregroundIcon"</div>}
/>

<HeroPresentation
variant="WIDGET_HERO_CENTER"
foreground={<h1 className="font-bold text-5xl">"foreground"</h1>}
foregroundIcon={<div>"foregroundIcon"</div>}
/>
```

Variant left (with & without image):

```jsx padded
<HeroPresentation
variant="WIDGET_HERO_LEFT"
background="https://dev.firstvoices.com/nuxeo/nxfile/default/51ac02d0-27c3-44c6-8674-b13699369cd5/picture:views/2/content/Medium_TestPhoto.jpg"
foreground={<h1 className="font-bold text-5xl">"foreground"</h1>}
foregroundIcon={<div>"foregroundIcon"</div>}
/>

<HeroPresentation
variant="WIDGET_HERO_LEFT"
foreground={<h1 className="font-bold text-5xl">"foreground"</h1>}
foregroundIcon={<div>"foregroundIcon"</div>}
/>
```

Variant search:

```jsx
<HeroPresentation
  variant="WIDGET_HERO_SEARCH"
  background="https://dev.firstvoices.com/nuxeo/nxfile/default/51ac02d0-27c3-44c6-8674-b13699369cd5/picture:views/2/content/Medium_TestPhoto.jpg"
  foreground={<h1 className="font-bold text-5xl">"foreground"</h1>}
  foregroundIcon={<div>"foregroundIcon"</div>}
  search={<input placeholder="Search here" />}
/>
```
