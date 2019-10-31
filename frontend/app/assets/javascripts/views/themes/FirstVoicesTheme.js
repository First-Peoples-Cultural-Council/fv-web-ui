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
export default {
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 18,
  },
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
  button: {
    contained: {
      color: 'red',
      backgroundColor: 'black',
      '&:hover': {
        color: 'black',
        backgroundColor: 'red',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'blue',
        },
        // NOTE:  the '&$disabled' rule below triggers a warning for some reason
        // '&$disabled': {
        //   backgroundColor: 'grey',
        // },
      },
    },
    containedPrimary: {
      color: 'white',
      backgroundColor: 'black',
      '&:hover': {
        color: 'black',
        backgroundColor: 'white',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'yellow',
        },
      },
    },
    containedSecondary: {
      color: 'blue',
      backgroundColor: 'yellow',
      '&:hover': {
        color: 'yellow',
        backgroundColor: 'blue',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'pink',
        },
      },
    },
  },
}
