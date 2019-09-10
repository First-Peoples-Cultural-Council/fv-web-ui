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
import { teal, grey, pink } from '@material-ui/core/colors'
import Spacing from '@material-ui/core/styles/spacing'
import zIndex from '@material-ui/core/styles/zIndex'

// v0
const v0 = {
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
    primary1Color: teal[400],
    primary2Color: teal[700],
    primary3Color: grey[800],
    // primary4Color
    // primary4ColorLightest
    accent1Color: pink.A200,
    accent2Color: '#529c95',
    accent3Color: grey[500],
    // accent4Color
    textColor: grey[900],
    // textColorFaded
    alternateTextColor: grey[50],
    canvasColor: grey[50],
    borderColor: grey[300],
    disabledColor: grey[500],
    pickerHeaderColor: teal[400],
  },
  wrapper: {
    backgroundColor: grey[50],
  },
}

// v1
export const FirstVoicesWorkspaceThemeV1 = {
  spacing: Spacing,
  zIndex: zIndex,
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 18,
  },
  palette: {
    primary: {
      light: '#64d8cb',
      main: '#26a69a',
      dark: '#00766c',
      contrastText: '#000000',
    },
    secondary: {
      light: '#718792',
      main: '#455a64',
      dark: '#1c313a',
      //   contrastText: getContrastText(palette.secondary.A400),
    },
    // error: {
    //   light: palette.error[300],
    //   main: palette.error[500],
    //   dark: palette.error[700],
    //   contrastText: getContrastText(palette.error[500]),
    // },
  },
  v0,
}
