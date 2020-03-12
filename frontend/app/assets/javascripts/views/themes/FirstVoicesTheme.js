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
/*
'Cedar'
#a3291d
rgb(163, 41, 29)

'Black'
#2b2e34
rgb(43, 46, 52)

'Grey'
#59584c
rgb(89, 88, 76)
*/
import typography from './FirstVoicesTypography'
export default {
  typography,
  palette: {
    primary: {
      contrastText: '#ffffff',
      dark: '#7d0000',
      light: '#ee492d',
      main: '#a3291d',
    },
    secondary: {
      main: '#2b2e34',
    },
    primary1Color: '#b40000',
    primary2Color: '#3a6880',
    accent4Color: '#e1e1e2',
  },
  appBarIcon: {
    color: '#fff',
  },
  appBar: {
    color: '#fff',
    backgroundColor: '#b40000',
    'a&:hover': {
      color: '#000',
    },
  },
  localePicker: {
    color: '#fff',
    backgroundColor: '#ab0000',
  },
  immersionSwitch: {
    color: '#fff!important',
  },
  dialectContainer: {
    color: '#fff',
    backgroundColor: '#3a6880',
    '&:visited': {
      color: '#fff',
    },
  },
  button: {
    containedPrimary: {
      color: '#fff',
      backgroundColor: '#b40000',
      '&:hover': {
        color: '#fff',
        backgroundColor: '#d57470',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: '#d57470',
        },
      },
      '&$disabled': {
        color: '#a1a1a1',
        backgroundColor: '#e5e5e5',
      },
    },
    containedSecondary: {
      color: '#fff',
      backgroundColor: '#bc0000',
      '&:hover': {
        color: '#360000',
        backgroundColor: '#f18f8b',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: '#f18f8b',
        },
      },
      '&$disabled': {
        color: '#fff',
        backgroundColor: '#deb8b8',
      },
    },
    outlinedPrimary: {
      color: '#FF5790',
      borderColor: '#FF5790',
      fill: '#FF5790',
      '&:hover': {
        color: '#ff87b0',

        borderColor: '#ff87b0',
        // backgroundColor: '#fff',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: '#ff87b0',
          fill: '#ff87b0',
        },
      },
      '&$disabled': {
        color: '#a1a1a1',
        borderColor: '#e5e5e5',
        fill: '#e5e5e5',
      },
    },
    outlinedSecondary: {
      color: '#26a69a',
      borderColor: '#26a69a',
      fill: '#26a69a',
      '&:hover': {
        color: '#89cac2',
        borderColor: '#89cac2',
        fill: '#89cac2',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          borderColor: 'pink',
          fill: 'pink',
        },
      },
      '&$disabled': {
        color: '#a1a1a1',
        borderColor: '#e5e5e5',
        fill: '#e5e5e5',
      },
    },
  },
  tab: {
    label: {
      fontSize: '1.6rem',
    },
    tabsIndicator: {
      backgroundColor: '#ee492d',
      height: '3px',
    },
    tabRoot: {
      opacity: 1,
      '&:focus': {
        color: '#FFF',
      },
      '&:hover': {
        backgroundColor: '#920f0f',
      },
    },
    tabsRoot: {
      backgroundColor: '#b40000',
      color: '#fff',
    },
    tabSelected: {
      color: '#fff',
      backgroundColor: '#5f0a0b',
      '&:hover': {
        backgroundColor: '#5f0a0b',
      },
    },
  },
}
