const {
  sendEmail,
  sendSgEmail,
  errorsCounter,
  sendMessageToSlack,
} = require('../helpers');

const logger = require('../logger');

const fs = require('fs');

const pathToAttachment = 'app.log';

let attachment;
let fatalErrCount;
let systemErrCount;
let errCount;

function getErrorCounts() {
  return new Promise((resolve, reject) => {
    errorsCounter(
      pathToAttachment,
      (err, fatalErrorCount, errorCount, systemErrorCount) => {
        if (err) {
          return reject(err);
        }
        fatalErrorCount === 0
          ? (fatalErrCount = 'No Fatal errors in logs')
          : (fatalErrCount = fatalErrorCount);
        systemErrorCount === 0
          ? (systemErrCount = 'No System errors in logs')
          : (systemErrCount = systemErrorCount);
        errorCount === 0
          ? (errCount = 'No errors in logs')
          : (errCount = errorCount);

        resolve(); // Resolve the promise once the counts are available
      }
    );
  });
}

const getLogs = async (req, res) => {
  await getErrorCounts();
  console.error(`system in logs: ${systemErrCount}`);
  console.error(`fatalErrors in logs: ${fatalErrCount}`);
  console.error(`errors in logs ${errCount}`);

  const email = {
    to: 'fuelfree.site@gmail.com',
    subject: 'Logs from fuelfree.site',
    text: 'Results sent from log_test',
    html: `<!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Get Logs from FuelFree site</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  /**
   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
   */
  @media screen {
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
    }

    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 700;
      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
    }
  }

  /**
   * Avoid browser level font resizing.
   * 1. Windows Mobile
   * 2. iOS / OSX
   */
  body,
  table,
  td,
  a {
    -ms-text-size-adjust: 100%; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }

  /**
   * Remove extra space added to tables and cells in Outlook.
   */
  table,
  td {
    mso-table-rspace: 0pt;
    mso-table-lspace: 0pt;
  }

  /**
   * Better fluid images in Internet Explorer.
   */
  img {
    -ms-interpolation-mode: bicubic;
  }

  /**
   * Remove blue links for iOS devices.
   */
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }

  /**
   * Fix centering issues in Android 4.4.
   */
  div[style*="margin: 16px 0;"] {
    margin: 0 !important;
  }

  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /**
   * Collapse table borders to avoid space between cells.
   */
  table {
    border-collapse: collapse !important;
  }

  a {
    color: #1a82e2;
  }

  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }
  </style>

</head>
<body style="background-color: #e9ecef;">

  <!-- start preheader -->
  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
             FuelFree site LOGO
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Logs from FuelFree site</h1>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
            
  <p style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -1px; line-height: 48px">CRITICAL ERRORS:  <span style="color: #FF0000">${fatalErrCount}</span></p>  
  <p style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -1px; line-height: 48px">NON-CRITICAL ERRORS: <span style="color: #FFA500">${errCount}</span></p>
  <p style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -1px; line-height: 48px">SYSTEM ERRORS: <span style="color: #0013de">${systemErrCount}</span></p><br>

  <p style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -1px; line-height: 48px">Find Log file in attachment</p>

              </td>
          </tr>
          <!-- end copy -->


          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
              <p style="margin: 0;">Cheers,<br>FuelFree Team</p>
            </td>
          </tr>
          <!-- end copy -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end copy block -->

    <!-- start footer -->
    <tr>
      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end footer -->
  </table>
  <!-- end body -->

</body>
</html>`,
  };

  // Read log file base 64
  if (pathToAttachment !== undefined) {
    attachment = fs.readFileSync(pathToAttachment, { encoding: 'utf8' });
    email.attachments = [
      {
        content: attachment,
        filename: 'app.log',
        type: 'text/html',
        disposition: 'attachment',
        content_id: 'app.log',
      },
    ];
  } else {
    email.attachments = undefined;
  }

  try {
    await sendEmail(email);
    logger.info('logs send by smtp');
    return true;
  } catch (err) {
    logger.error(err.message);
    try {
      await sendSgEmail(email);
      logger.info('logs send by sendGrid');
    } catch (err) {
      logger.error(err.message);
      sendMessageToSlack(
        ':slightly_frowning_face: Error sending logs by email. Check your App. :eyes:'
      );
    }
  }
};

module.exports = { getLogs };
