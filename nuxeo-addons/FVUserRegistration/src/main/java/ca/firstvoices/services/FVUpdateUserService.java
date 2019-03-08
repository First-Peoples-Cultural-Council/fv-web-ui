package ca.firstvoices.services;

public class FVUpdateUserService {
}
/*
       DocumentModel userDoc = userManager.getUserModel(username);

        if (userDoc == null)
        {
            throw new OperationException("Cannot update non-existent user: " + username);
        }

        if( terminateOnInvalidCredentials_UU( session, userManager, username ) ) return; // invalid credentials

        if (groups != null)
        {
            StringList alwaysLowerCase = new StringList();
            for(String gn : groups )
            {
                alwaysLowerCase.add( gn.toLowerCase());
            }

            updateFVProperty( groupsAction, userDoc, alwaysLowerCase, SCHEMA_NAME, GROUPS_COLUMN );
        }

        for (Entry<String, String> entry : Arrays.asList( //
               // new SimpleEntry<>(PASSWORD_COLUMN, password), //
                new SimpleEntry<>(EMAIL_COLUMN, email), //
                new SimpleEntry<>(FIRSTNAME_COLUMN, firstName), //
                new SimpleEntry<>(LASTNAME_COLUMN, lastName), //
                new SimpleEntry<>(COMPANY_COLUMN, company)))
        {
            String key = entry.getKey();
            String value = entry.getValue();
            if (StringUtils.isNotBlank(value))
            {
                properties.put(key, value);
            }
        }
        for (Entry<String, String> entry : properties.entrySet())
        {
            String key = entry.getKey();
            String value = entry.getValue();
            if (key.startsWith(USER_COLON))
            {
                key = key.substring(USER_COLON.length());
            }
            userDoc.setProperty(SCHEMA_NAME, key, value);
        }

        userManager.updateUser(userDoc);
    }

 */