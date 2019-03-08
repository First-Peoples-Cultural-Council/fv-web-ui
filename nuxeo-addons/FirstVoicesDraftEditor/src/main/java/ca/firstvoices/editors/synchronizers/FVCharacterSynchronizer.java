package ca.firstvoices.editors.synchronizers;

import static ca.firstvoices.editors.synchronizers.SynchronizerUtilities.handleListMapProperty;

public class FVCharacterSynchronizer extends AbstractSynchronizer {

    /**
     * @param typeName
     * @param propertyPath
     */
    public void synchronizeFV(String typeName, String propertyPath) {
        switch (typeName) {
            case "fv_literal_translationListType":
            case "fv_definitionsListType":
                handleListMapProperty(draft, live, propertyPath, "language", "translation", auditTrail);

            default:
                synchronizeCommon(typeName, propertyPath);
        }
    }
}
