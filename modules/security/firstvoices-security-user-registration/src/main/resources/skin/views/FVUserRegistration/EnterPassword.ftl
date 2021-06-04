<#assign siteURL = Context.getServerURL().toString()?replace("/nuxeo", "")?replace("8080", "3001")>

<!DOCTYPE html>
<!--[if lte IE 8]>
<html class="lt-ie9  no-js" lang="en">
<![endif]-->
<!--[if gt IE 8]><!-->
<html lang="en" class="no-js">
<!--<![endif]-->
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>FirstVoices - ${Context.getMessage('label.registerForm.title')}</title>
    <meta name="description"
          content="FirstVoices is a suite of web-based tools and services designed to support Indigenous people engaged in language archiving, language teaching and culture revitalization." />
    <meta name="author" content="FPCC" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style type='text/css'>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #101010;
            line-height: 24px;
        }

        h1 {
            font-weight: 900;
            font-size: 24px;
        }

        .container-box {
            border: 1px #010101 solid;
            width: 100%;
            max-width: 650px;
            margin: 15px auto;
            text-align: center;
        }

        form.fv-form input {
            border: 1px solid #a9a9a9;
            font-size: 18px;
            margin: 5px;
            padding: 2px;
            width: 300px;
        }

    </style>

    <script type="text/javascript">
      function validateMyForm() {
        var passwordFieldInput = document.getElementById('Password');
        var passwordFieldConfInput = document.getElementById('PasswordConfirmation');
        var errorMessageBox = document.getElementById('errorMessageJS');


        // Check if passwords match
        if (passwordFieldInput.value != passwordFieldConfInput.value) {
          errorMessageBox.innerHTML = 'Your password and password confirmation do not match.'
          return false;
        } else {
          var passMatch = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
          if (!passMatch.test(passwordFieldInput.value)) {
            errorMessageBox.innerHTML = 'Select a strong password at least 8 characters long, with at least 1 capital letter, lowercase letter, and number.'
            return false;
          }
        }

        return true;

      }
    </script>
</head>
<body id="body">

<div class="container-box">

    <div data-component-id="AppBar"
         style="background-color:#b40000;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;box-sizing:border-box;font-family:Arial, sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);box-shadow:0 1px 6px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.12);border-radius:0px;position:relative;z-index:1100;width:100%;display:flex;min-height:64px;padding-left:24px;padding-right:24px;"
         data-reactid=".0.0.1.0.0">
        <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0;padding-top:15px;letter-spacing:0;font-size:24px;font-weight:400;color:#ffffff;line-height:64px;box-flex:1;flex:1;"
             data-reactid=".0.0.1.0.0.1"><span class="hidden-xs" data-reactid=".0.0.1.0.0.1.0"><img
                        src="${siteURL}/assets/images/logo.png" style="padding:0 0 5px 0;" alt="FirstVoices"
                        data-reactid=".0.0.1.0.0.1.0.0"></span></div>
    </div>


    <div style="margin-bottom:15px;text-align:center;">
        <h1 style="font-weight:500;">Choose a Password</h1>

        <div>
            <form class="fv-form" action="/nuxeo/site/fv/users/validate" method="post"
                  enctype="application/x-www-form-urlencoded" name="submitNewPassword"
                  onsubmit="return validateMyForm();">
                <input type="hidden" id="RequestId" value="${data['RequestId']}" name="RequestId" />
                <input type="hidden" id="ConfigurationName" value="${data['ConfigurationName']}"
                       name="ConfigurationName" />
                <div style="color: red; font-weight: bold;" class="errorMessage" id="errorMessageJS">
                </div>
                <div style="color: red; font-weight: bold;" class="errorMessage" id="errorMessage">
                    <#if err??>
                        ${Context.getMessage("label.connect.trial.form.errvalidation")}
                        ${err}

                    </#if>
                </div>
                <#if info??>
                    <div class="infoMessage">
                        ${info}
                    </div>
                </#if>
                <div>
                    <input placeholder="Enter your password" type="password" id="Password" value="${data['Password']}"
                           name="Password" class="login_input" isRequired="true" autofocus required />
                    <i class="icon-key"></i>
                </div>
                <div>
                    <input placeholder="Repeat your password" type="password" id="PasswordConfirmation"
                           value="${data['PasswordConfirmation']}" name="PasswordConfirmation" class="login_input"
                           isRequired="true" required />
                    <i class="icon-key"></i>
                </div>
                <div>
                    <input type="submit" name="submit" value="Submit Password" />
                </div>
            </form>

            <div style="text-align: left;padding-left: 25px;">
                Pick a password that is at least 8 characters long<br />
                Include at least 1 capital letter, lowercase letter, and number
            </div>
        </div>

    </div>

    <div style="color:#fff;font-weight:bold;background: 0 95% url(${siteURL}/assets/images/footer-background.png) no-repeat;height:45px;padding-top: 15px;">
        Need help? Feel free to contact us at support@fpcc.ca
        <!--
		Useful variables
		${Context.modulePath}
		${This.path}
		${skinPath}
		-->
    </div>

</div>

</body>
</html>
