import java.io.FileNotFoundException;
import tasks.contributors.CleanContributors;
import tasks.database.ClearWords;
import tasks.database.CreateLanguage;
import tasks.database.DeleteLanguage;
import tasks.dictionary.DictionaryAppCompatibleExport;
import tasks.dictionary.DictionaryFieldCorrection;
import tasks.dictionary.DictionaryExport;
import tasks.dictionary.DictionarySimpleExport;
import tasks.dictionary.DictionaryStatusCorrection;
import tasks.dictionary.fromCSV.DictionaryRelatedAssetsAssignment;
import tasks.maps.ImportCommunityDataFromCSV;
import tasks.maps.ImportLanguageDataFromCSV;
import tasks.maps.ImportStatsDataFromCSV;
import tasks.maps.UpdateMapData;
import tasks.tasks.CleanDuplicateStaleTasks;
import tasks.tasks.MAPPublishPhotos;
import tasks.tasks.MigrateSharedCategories;
import tasks.tasks.MigrateAllSharedCategories;
import tasks.tasks.GeneralTask;
import tasks.users.CleanExportRegistrations;
import tasks.users.ImportUserRegistrations;
import tasks.users.OverwritePreferences;
import tasks.users.QueryUsers;

public class TaskSwitcher {

    private static void printDesc(String arg0, String desc) {
        System.out.println(arg0 + " | DESC: " + desc);
    }

    public static void main(String[] argv) throws FileNotFoundException {

        System.out.println("Selecting task...");

        if (argv[0] != null) {

            String taskName = argv[0];

            switch (taskName) {
                case "users-overwrite-preferences":
                    printDesc(taskName, OverwritePreferences.getDescription());
                    OverwritePreferences.execute(argv);
                    break;

                case "users-clean-export-registrations":
                    printDesc(taskName, CleanExportRegistrations.getDescription());
                    CleanExportRegistrations.execute(argv);
                    break;

                case "users-query":
                    printDesc(taskName, QueryUsers.getDescription());
                    QueryUsers.execute(argv);
                    break;

                case "contributors-clean-records":
                    printDesc(taskName, CleanContributors.getDescription());
                    CleanContributors.execute(argv);
                    break;

                case "users-import-registrations":
                    printDesc(taskName, ImportUserRegistrations.getDescription());
                    ImportUserRegistrations.execute(argv);
                    break;

                case "dictionary-related-assets-assignment":
                    printDesc(taskName, DictionaryRelatedAssetsAssignment.getDescription());
                    DictionaryRelatedAssetsAssignment.execute(argv);
                    break;

                case "maps-import-language-data":
                    printDesc(taskName, ImportLanguageDataFromCSV.getDescription());
                    ImportLanguageDataFromCSV.execute(argv);
                    break;

                case "maps-import-community-data":
                    printDesc(taskName, ImportCommunityDataFromCSV.getDescription());
                    ImportCommunityDataFromCSV.execute(argv);
                    break;

                case "maps-import-stats-data":
                    printDesc(taskName, ImportStatsDataFromCSV.getDescription());
                    ImportStatsDataFromCSV.execute(argv);
                    break;

                case "maps-update-data":
                    printDesc(taskName, UpdateMapData.getDescription());
                    UpdateMapData.execute(argv);
                    break;

                case "dictionary-field-correction":
                    printDesc(taskName, DictionaryFieldCorrection.getDescription());
                    DictionaryFieldCorrection.execute(argv);
                    break;

                case "dictionary-status-correction":
                    printDesc(taskName, DictionaryStatusCorrection.getDescription());
                    DictionaryStatusCorrection.execute(argv);
                    break;

                case "clean-duplicate-stale-tasks":
                    printDesc(taskName, CleanDuplicateStaleTasks.getDescription());
                    CleanDuplicateStaleTasks.execute(argv);
                    break;

                case "migrate-shared-categories":
                    printDesc(taskName, MigrateSharedCategories.getDescription());
                    MigrateSharedCategories.execute(argv);
                    break;

                case "migrate-all-shared-categories":
                    printDesc(taskName, MigrateAllSharedCategories.getDescription());
                    MigrateAllSharedCategories.execute(argv);
                    break;
                    
                case "general-task":
                    printDesc(taskName, GeneralTask.getDescription());
                    GeneralTask.execute(argv);
                    break;

                case "mentor-apprentice-publish-photos-task":
                    printDesc(taskName, MAPPublishPhotos.getDescription());
                    MAPPublishPhotos.execute(argv);
                    break;

                case "dictionary-export":
                    printDesc(taskName, DictionaryExport.getDescription());
                    DictionaryExport.execute(argv);
                    break;

                case "dictionary-simple-export":
                    printDesc(taskName, DictionarySimpleExport.getDescription());
                    DictionarySimpleExport.execute(argv);
                    break;

                case "dictionary-app-compatible-export":
                    printDesc(taskName, DictionaryAppCompatibleExport.getDescription());
                    DictionaryAppCompatibleExport.execute(argv);
                    break;
                    
                case "create-language":
                    printDesc(taskName, CreateLanguage.getDescription());
                    CreateLanguage.execute(argv);
                    break;
    
                case "delete-language":
                    printDesc(taskName, DeleteLanguage.getDescription());
                    DeleteLanguage.execute(argv);
                    break;
    
                case "clear-words":
                    printDesc(taskName, ClearWords.getDescription());
                    ClearWords.execute(argv);
                    break;

                default:
                    System.out.println("-> ABORT: Task not found.");
                    System.exit(1);
            }
        }

    }
}
