import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils'; //I like using the Test Utils, but you can just use the DOM API instead.
import expect from 'expect';
import providers from '../providers/index';
import ConfGlobal from 'conf/local.json';
import AppWrapper from '../views/AppWrapper';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import FirstVoicesTheme from '../views/themes/FirstVoicesTheme.js';

const context = {
  providers,
  providedState: {
      properties: {
          title: ConfGlobal.title,
          pageTitleParams: null,
          domain: ConfGlobal.domain,
          theme: {
              palette: ThemeManager.getMuiTheme(FirstVoicesTheme),
              id: 'default'
          }
      }
  }
};

/*
  Basic test flow to ensure app is rendering
*/
describe('AppWrapper', function () {
  it('renders without problems', function () {
    var app = TestUtils.renderIntoDocument(<AppWrapper {...context} />);
    expect(app).toBeTruthy();
  });
});