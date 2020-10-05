<html>
  <body>
    <#--
      Debug available variables (excluding Runtime):
      <#list .data_model?keys as k>
      For Freemarker documentation: https://freemarker.apache.org/docs/index.html
    ${k}
    </#list>
    -->

    <p>
      <strong>${author}</strong>
      has requested changes for
      <#if document.type == "FVWord">
      the word
      <strong>
        <a
          href="${Runtime.getProperty('nuxeo.url')}/explore${document.path?keep_before('Dictionary')}/learn/words/${docId}">
          ${htmlEscape(docTitle)}
        </a>
      </strong>
      <#elseif document.type == "FVPhrase">
      the phrase
      <strong>
        <a
          href="${Runtime.getProperty('nuxeo.url')}/explore${document.path?keep_before('Dictionary')}/learn/phrases/${docId}">
          ${htmlEscape(docTitle)}
        </a>
      </strong>
      <#elseif document.type == "FVBook">
      the ${document.fvbook.type}
      <#assign pluralType = (document.fvbook.type == "song")?then("songs","stories")>
      <strong>
        <a
          href="${Runtime.getProperty('nuxeo.url')}/explore${document.path?keep_before('Songs')}/learn/phrases/${docId}">
          ${htmlEscape(docTitle)}
        </a>
      </strong>
    </#if>

    <#if comment != "">
    with the following comment:
    <#else>
    with no comment.
    </#if>
    <br/>
  </p>

  <#assign extractedComment = comment?keep_after("with the following comment:")>
  <blockquote>${htmlEscape(extractedComment)}</blockquote>

  <p>
  The request was made on <strong>${dateTime?datetime?string("dd/MM/yyyy")}</strong>. This message
  has been sent to all recorders in your language team.
  </p>

  </body>
  </html>