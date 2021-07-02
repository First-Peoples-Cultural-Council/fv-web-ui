package ca.firstvoices.operations.audiofix;

import java.util.List;
import java.util.Optional;
import javax.naming.NamingException;
import javax.transaction.SystemException;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.PropertyException;
import org.nuxeo.ecm.core.api.ScrollResult;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.runtime.transaction.TransactionHelper;

@Operation(id = AudioFixOperation.ID,
    category = Constants.CAT_SCRIPTING,
    label = "Fix permissions on audio files",
    description = "")

public class AudioFixOperation {

  public static final String ID = "Scripting.AudioFix";
  public static final Log log = LogFactory.getLog(AudioFixOperation.class);

  @Context CoreSession coreSession;

  @Param(name = "parentId", required = true) String parentId;
  @Param(name = "dryRun", required = false) boolean dryRun = false;

  @OperationMethod()
  public String run() {
    if (!coreSession.getPrincipal().isAdministrator()) {
      throw new IllegalArgumentException("You must be an administrator to run this operation");
    }

    try {
      TransactionHelper.lookupTransactionManager().setTransactionTimeout(14400);
    } catch (NamingException | SystemException e) {
      log.error("Error modifying default transaction timeout", e);
    }


    log.info("Starting update of audio file ACLS");
    StringBuffer output = new StringBuffer();


    CoreInstance.doPrivileged(coreSession, session -> {

      long publicReadGranted = 0;
      long membersReadGranted = 0;
      long languageTeamReadGranted = 0;
      long audioFilesChecked = 0;
      long proxiedCount = 0;


      ScrollResult<String> scrollResult = session.scroll("SELECT * FROM FVWord where "
              + "ecm:isTrashed=0 and "
              + "ecm:isVersion=0 and "
              + "ecm:ancestorId = " + NXQL.escapeString(parentId) + "",
          100,
          9999);

      while (scrollResult.hasResults()) {

        List<String> page = scrollResult.getResults();

        boolean checkPublicReadAccess = false;
        boolean checkMembersAccess = false;
        boolean checkLanguageMemberAccess = false;

        String languageTeamACEUsername = null;

        for (String id : page) {
          DocumentModel wordDocument = session.getDocument(new IdRef(id));

          ACL[] wordACLs = wordDocument.getACP().getACLs();
          for (ACL acl : wordACLs) {
            ACE[] wordACES = acl.getACEs();
            for (ACE ace : wordACES) {
              if (ace.getPermission().equalsIgnoreCase("read") && ace.isGranted() && ace
                  .getUsername()
                  .equalsIgnoreCase("guest")) {
                checkPublicReadAccess = true;
              }
              if ((ace.getPermission().equalsIgnoreCase("read") || ace
                  .getPermission()
                  .equalsIgnoreCase("everything")) && ace.isGranted() && ace
                  .getUsername()
                  .toLowerCase()
                  .endsWith("_members")) {
                checkLanguageMemberAccess = true;
                languageTeamACEUsername = ace.getUsername();
              }
              if (ace.getPermission().equalsIgnoreCase("read") && ace.isGranted() && ace
                  .getUsername()
                  .equalsIgnoreCase("members")) {
                checkMembersAccess = true;
              }
            }
          }


          String[] mergedAudioIdList = null;

          try {

            String[] relatedAudioIds = (String[]) wordDocument.getPropertyValue("fv:related_audio");
            String[] proxiedAudioIds = (String[]) wordDocument.getPropertyValue(
                "fvproxy:proxied_audio");


            if (relatedAudioIds != null && proxiedAudioIds != null) {
              mergedAudioIdList = ArrayUtils.addAll(relatedAudioIds, proxiedAudioIds);
            } else {
              mergedAudioIdList = Optional.ofNullable(relatedAudioIds).orElse(proxiedAudioIds);
            }

            if (proxiedAudioIds != null) {
              proxiedCount += proxiedAudioIds.length;
            }
          } catch (PropertyException e) {
            // don't care
          }


          if (mergedAudioIdList != null) {
            for (String audioId : mergedAudioIdList) {
              audioFilesChecked++;
              DocumentModel audioDocument = session.getDocument(new IdRef(audioId));
              // check acls on audioDocument

              if (checkPublicReadAccess) {
                if (!audioDocument.getACP().getAccess("Guest", "Read").toBoolean()) {
                  publicReadGranted++;
                  if (!dryRun) {
                    audioDocument.getACP().getOrCreateACL(ACL.LOCAL_ACL).add(new ACE.ACEBuilder(
                        "Guest",
                        "Read").isGranted(true).build());
                  }
                }
              }
              if (checkLanguageMemberAccess) {
                log.info("checking membership access for " + languageTeamACEUsername);
                languageTeamReadGranted++;
                if (languageTeamACEUsername != null) {
                  if (!audioDocument
                      .getACP()
                      .getAccess(languageTeamACEUsername, "Read")
                      .toBoolean()) {
                    log.info("word " + wordDocument.getTitle() + " audio file needs to add "
                        + languageTeamACEUsername + ":Read");
                    if (!dryRun) {
                      audioDocument.getACP().getOrCreateACL(ACL.LOCAL_ACL).add(new ACE.ACEBuilder(
                          languageTeamACEUsername,
                          "Read").isGranted(true).build());
                    }
                  }
                }

              }
              if (checkMembersAccess) {

                if (!audioDocument.getACP().getAccess("members", "Read").toBoolean()) {
                  membersReadGranted++;

                  if (!dryRun) {

                    audioDocument.getACP().getOrCreateACL(ACL.LOCAL_ACL).add(new ACE.ACEBuilder(
                        "members",
                        "Read").isGranted(true).build());

                  }
                }



              }
              if (!dryRun) {
                session.saveDocument(audioDocument);
              }
            }
          }
        }

        scrollResult = session.scroll(scrollResult.getScrollId());
      }

      output.append(String.format("Checked %d files\n"
          + "\t%d were proxies\n"
          + "\tAdded PUBLIC READ permission to %d audio files\n"
          + "\tAdded MEMBERS READ permission to %d audio files\n"
          + "\tAdded LANGUAGE TEAM MEMBERS READ permission to %d audio files\n",
          audioFilesChecked, proxiedCount, publicReadGranted, membersReadGranted,
          languageTeamReadGranted));

      if (dryRun) {
        output.append("\n\n---DRY RUN (NO CHANGES MADE)---");
      }

    });

    return output.toString();

  }


}
