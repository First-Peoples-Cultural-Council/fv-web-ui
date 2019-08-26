/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { cyan, pink, grey } from '@material-ui/core/colors'
import Spacing from '@material-ui/core/styles/spacing'
import zIndex from '@material-ui/core/styles/zIndex'

export default {
  spacing: Spacing,
  zIndex: zIndex,
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  primary: {
    contrastText: '#0000ff',
    dark: '#0b1735',
    light: '#eeeed1',
    main: '#b40000',
  },
  palette: {
    primary1Color: '#b40000',
    primary2Color: cyan[700],
    primary3Color: grey[800],
    accent1Color: pink.A200,
    accent2Color: grey[100],
    accent3Color: grey[500],
    textColor: grey[900],
    alternateTextColor: grey[50],
    canvasColor: grey[50],
    borderColor: grey[300],
    disabledColor: grey[500],
    pickerHeaderColor: cyan[500],
  },
  wrapper: {
    backgroundColor: grey[50],
  },
}
