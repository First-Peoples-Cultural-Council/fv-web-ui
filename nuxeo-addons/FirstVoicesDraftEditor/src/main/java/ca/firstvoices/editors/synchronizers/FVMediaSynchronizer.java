package ca.firstvoices.editors.synchronizers;

public class FVMediaSynchronizer extends AbstractSynchronizer {

    /**
     * @param typeName
     * @param propertyPath
     */
    public void synchronizeFV(String typeName, String propertyPath) {
        switch (typeName) {
            default:
                synchronizeCommon(typeName, propertyPath);
        }
    }
}