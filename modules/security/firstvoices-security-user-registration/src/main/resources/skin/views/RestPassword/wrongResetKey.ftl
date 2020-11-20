<@extends src="base_fv.ftl">

<@block name="title">
${Context.getMessage('label.wrongresetkey.title')}
</@block>
<@block name="header">
</@block>
<@block name="content">
    <h2>${Context.getMessage('label.wrongresetkey.title')}</h2>
      <table><tr><td>
        <p>${Context.getMessage('label.wrongresetkey.text')}
        </p>
      </td></tr></table>
</@block>
</@extends>
