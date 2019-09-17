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
import { cyan, grey, pink } from '@material-ui/core/colors'
import * as ColorManipulator from '@material-ui/core/styles/colorManipulator'
import Spacing from '@material-ui/core/styles/spacing'
import zIndex from '@material-ui/core/styles/zIndex'

export default {
  spacing: Spacing,
  zIndex: zIndex,
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 18,
  },
  palette: {
    primary: {
      light: '#ee492d',
      main: '#b40000',
      dark: '#7d0000',
      contrastText: '#fff',
    },
    primary1Color: '#b40000',
    primary2Color: cyan[700],
    primary3Color: grey[800],
    accent1Color: pink.A200,
    accent2Color: grey[100],
    accent3Color: grey[500],
    textColor: grey[900],
    alternateTextColor: '#fff',
    canvasColor: '#fff',
    borderColor: grey[300],
    disabledColor: ColorManipulator.fade('#000000', 0.3),
    pickerHeaderColor: cyan[500],
  },
  wrapper: {
    backgroundColor: '#fff',
  },
}
