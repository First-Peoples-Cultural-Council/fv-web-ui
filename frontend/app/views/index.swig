{% extends 'layouts/application.swig' %}

{% block content %}
<div id="app-wrapper" class="app-wrapper">
  <div id="app-loader" class="app-loader">
    <div class="app-loader-content">
      <h1><img src="/assets/images/logo.png" alt="FirstVoices" /></h1>
      <p>FirstVoices is a suite of web-based tools and services designed to support Indigenous people engaged in language archiving, language teaching and culture revitalization.</p>
      <p>Loading / Chargement / Cargando...</p>
  </div>
</div>
{% endblock %}

{% block head %}
<style type='text/css'>
  /** App Loader **/
  .app-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgb(170, 18, 37);
    color: #FFFFFF;
    text-align: center;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
  }
  .app-loader-content {
    max-width: 50%;
  }
</style>
{% endblock %}

{% block javascript %}

{% if buildENV == "production_DISABLE_FOR_NOW" %}
<script type="text/javascript">
  Raven.config('https://9f99c993909b4dda85e7178a0eadc7fa@sentry.io/1212465').install();
</script>

<!-- Matomo -->
<script type="text/javascript">
var _paq = _paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
  var u="//analytics.firstvoices.com/";
  _paq.push(['setTrackerUrl', u+'piwik.php']);
  _paq.push(['setSiteId', '1']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.type='text/javascript'; g.async=true; g.defer=true; g.src=u + 'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<!-- End Matomo Code -->
{% endif %}

{% endblock %}
