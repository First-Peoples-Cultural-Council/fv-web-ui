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
import { teal } from '@material-ui/core/colors'
import typography from './FirstVoicesTypography'
export default {
  typography,
  palette: {
    primary: {
      contrastText: '#000000',
      dark: '#00766c',
      light: '#64d8cb',
      main: '#26a69a',
    },
    secondary: {
      main: '#2b2e34',
    },
    primary1Color: teal[400],
    primary2Color: teal[700],
  },
  appBarIcon: {
    color: '#fff',
  },
  appBar: {
    color: '#fff',
    backgroundColor: '#26a69a',
    'a&:hover': {
      color: '#000',
    },
  },
  localePicker: {
    color: '#fff',
    backgroundColor: '#4d948d',
  },
  dialectContainer: {
    color: '#fff',
    backgroundColor: '#00796b',
    '&:visited': {
      color: '#fff',
    },
  },
  button: {
    containedPrimary: {
      color: '#fff', // '#000',
      backgroundColor: '#FF5790',
      '&:hover': {
        color: '#222',
        backgroundColor: '#ff87b0',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: '#ff87b0',
        },
      },
      '&$disabled': {
        color: '#a1a1a1',
        backgroundColor: '#e5e5e5',
      },
    },
    containedSecondary: {
      color: '#fff', // '#000',
      backgroundColor: '#26a69a',
      '&:hover': {
        color: '#2f2f2f',
        backgroundColor: '#89cac2',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'pink',
        },
      },
      '&$disabled': {
        color: '#a1a1a1',
        backgroundColor: '#e5e5e5',
      },
    },
  },
}
