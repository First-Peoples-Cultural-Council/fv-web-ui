Variant center (with & without image):

```jsx
<HeroPresentation
variant="WIDGET_HERO_CENTER"
background="dist/styleguide/TestPhoto.jpg"
foreground={<h1 className="font-bold text-5xl">"foreground"</h1>}
foregroundIcon={<div>"foregroundIcon"</div>}
/>
<br />
<HeroPresentation
variant="WIDGET_HERO_CENTER"
foreground={<h1 className="font-bold text-5xl">"foreground"</h1>}
foregroundIcon={<div>"foregroundIcon"</div>}
/>
```

Variant left (with & without image):

```jsx
<HeroPresentation
variant="WIDGET_HERO_LEFT"
background="dist/styleguide/TestPhoto.jpg"
foreground={<h1 className="font-bold text-5xl">"foreground"</h1>}
foregroundIcon={<div>"foregroundIcon"</div>}
/>
<br />
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
  background="dist/styleguide/TestPhoto.jpg"
  foreground={<h1 className="font-bold text-5xl">"foreground"</h1>}
  foregroundIcon={<div>"foregroundIcon"</div>}
  search={<input placeholder="Search here" />}
/>
```
