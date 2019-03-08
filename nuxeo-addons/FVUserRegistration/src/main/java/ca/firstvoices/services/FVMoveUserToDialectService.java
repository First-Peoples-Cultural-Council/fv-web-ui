package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.DocumentModel;

public interface FVMoveUserToDialectService {

     void placeNewUserInGroup( DocumentModel dialect, String groupName, String newUsername ) throws Exception;
     void moveUserBetweenGroups( DocumentModel dialect, String userName, String fromGroupName, String toGroupName ) throws Exception;
     void removeUserFromGroup( DocumentModel dialect, String fromGroupName );
     void addUserToGroup( DocumentModel dialect, String toGroupName );
}

