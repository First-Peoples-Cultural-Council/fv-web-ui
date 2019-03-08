<!DOCTYPE html>
<!--[if lte IE 8]><html class="lt-ie9  no-js" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html lang="en"  class="no-js"><!--<![endif]-->
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <title>{% block title %}FirstVoices{% endblock %}</title>
    <meta name="description" content="FirstVoices is a suite of web-based tools and services designed to support Indigenous people engaged in language archiving, language teaching and culture revitalization."/>
    <meta name="author" content="FPCC"/>
    <meta name="google-site-verification" content="EDJl0zb8mhsF1z_YbnEcdOwKF72uLcZw_3FGbSMVGSM" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <link rel="shortcut icon" href="/assets/images/favicon.ico" />

    <style>
      .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-feature-settings: 'liga';
        font-feature-settings: 'liga';
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
      }

    </style>

    <script type="text/javascript">
      // Alloy editor configuration
      window.ALLOYEDITOR_BASEPATH = window.CKEDITOR_BASEPATH = '/assets/vendor/alloyeditor/';
    </script>

    {% if buildENV == "production_DISABLE_FOR_NOW" %}<script src="https://cdn.ravenjs.com/3.25.2/raven.min.js" crossorigin="anonymous"></script>{% endif %}

    {% block head %}{% endblock %}

  </head>
  <body id="body">

    <div id="wrapper">

        <div class="container-fluid" id="page-wrapper">
            {% block content %}{% endblock %}
        </div>
        <div class="container-fluid" id="page-absolute-footer" style="background-color: #0d6c80;color: #fff;text-align:right;">
            Version: {{uiVersion}}
        </div>
        <!-- /#page-wrapper -->

        <!--<div style="position: fixed;
  width: 700px;
  background: #ffe14f;
  bottom: 0;
  right: 0;
  padding: 5px;
  border-radius: 5px 0 0 0;
  border: 1px solid #dac73f;
  border-bottom: 0;"><strong>Note</strong>: FirstVoices will be updated on <strong>August 7th @ 9:00 PM</strong> and will be unavailable for 2-3 minutes.</div>-->

    </div>
    <!-- /#wrapper -->
    <script src="/assets/javascripts/vendors.js"></script>
    <script src="/assets/javascripts/shared.js"></script>
    <script src="/assets/javascripts/app.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
    <script>
      WebFont.load({
        google: {
          families: ['Material Icons']
        }
      });
    </script>
    {% block javascript %}{% endblock %}

  </body>
</html>
