import { validateTextForDisallowedBigQeryFieldPrefixes_ } from "./bigquerydisalowedprefixes";
import { validateForDatabaseReservedNamesList_ } from "./databasereservedwords";
import { validateMaxBigQueryFieldChars_ } from "./textlength";
import { validateDatabaseValueForDuplicates_ } from "./duplicates";
import { validateFieldNameAllowedDatabaseChars_ } from "./allowedchars";
import { validateDataBaseStringStartsWith_ } from "./databasestartswith";

/** @typedef {import("@/names/getvalidatedname").ValidHeaderRule} ValidHeaderRule */

/**
 * @returns {ValidHeaderRule[]}
 */
export function getBigQueryFieldNamingRules_() {
  return [
    {
      key: "starts with",
      description: "A column name must start with a letter or underscore",
      test_function: validateDataBaseStringStartsWith_,
      message: "A column name must start with a letter or underscore",
    },
    {
      key: "allowed chars",
      description:
        "A column name can contain letters (a-z, A-Z), numbers (0-9), or underscores (_), Use lower case and `_` convention",
      test_function: validateFieldNameAllowedDatabaseChars_,
    },
    {
      key: "bigquery prefix",
      description:
        "Column names can't use any of the following prefixes: _TABLE_, _FILE_, _PARTITION, _ROW_TIMESTAMP, __ROOT__, _COLIDENTIFIER",
      test_function: validateTextForDisallowedBigQeryFieldPrefixes_,
    },
    {
      key: "reserved keywords",
      description: "Column name cannot be reserved kayword",
      test_function: validateForDatabaseReservedNamesList_,
    },
    {
      key: "duplicates",
      description:
        "Duplicate column names are not allowed even if the case differs.",
      test_function: validateDatabaseValueForDuplicates_,
    },
    {
      key: "max length",
      description: "Column names have a maximum length of 300 characters",
      test_function: validateMaxBigQueryFieldChars_,
    },
  ];
}
