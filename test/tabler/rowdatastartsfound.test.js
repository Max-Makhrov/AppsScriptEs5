import { Tabler_ } from "@/talbler";
import { valueTableSamples } from "./tablesamples";
import { expect, test } from "vitest";
import { getAllValuesClusters_ } from "@/tablers/columntypecluster/getvaluesclusters";
import { findNextBestFitValuesCluster_ } from "@/tablers/columntypecluster/getnextbestcluster";
import { getInitialFitColumnValuesClustersInfo_ } from "@/tablers/columntypecluster/fits/getfitclustersoptions";
import { getColumnValueClustersRowFit_ } from "@/tablers/columntypecluster/fits/getclustersrowfit";
import { reduceFittingClustersByMaxColumnGap_ } from "@/tablers/columntypecluster/fits/notfitclustersbycolumngaps";
import { getAllMatchedColumnValueClutersHeaders_ } from "@/tablers/columntypecluster/fits/getmatchedclustersheaders";
import { getColumnValueClusterHeaderIslands_ } from "@/tablers/columntypecluster/fits/clusterheaderislands";
import { getBiggerClusterHeadersByIslands_ } from "@/tablers/columntypecluster/fits/biggerheaderisland";
import { getFullValuesClusterHeaderInfoMap_ } from "@/tablers/columntypecluster/clusterstoschema/fitheaders/fullclusterheadersinfo";
import { getDedupedColumnsValuesClusterFullInfo_ } from "@/tablers/columntypecluster/fits/dedupeclusters";
import { getValuesClustersFirstDataRow_ } from "@/tablers/columntypecluster/clusterstoschema/clustersrowstarts";
import { getValuesClustersLastDataRow_ } from "@/tablers/columntypecluster/clusterstoschema/clustersrowend";
import { getCommonColumnValuesClustersMissingColumns_ } from "@/tablers/columntypecluster/fits/commonmissingrows";
import { getDataValuesClustersMissingColumns_ } from "@/tablers/columntypecluster/fits/missingcolumns";
import { getRichColumnValuesClustersHeaders_ } from "@/tablers/columntypecluster/fits/richheaders";
import { getBestValueClustersFullInfoForSchema_ } from "@/tablers/columntypecluster/fits/bestschemaclusters";
test("Row Data Starts cannot be null", () => {
  for (let k in valueTableSamples) {
    const element = valueTableSamples[k];
    const ta = new Tabler_(element);
    const schema = ta.getSchema();
    if (schema !== null) {
      if (
        schema.row_data_starts === null ||
        schema.row_data_starts === Infinity
      ) {
        console.log("👀", k);
      }
      expect(schema.row_data_starts).not.toBeNull();
      expect(schema.row_data_starts).not.toBe(Infinity);
    }
  }
});

const values = valueTableSamples.Smoke;
const clustersMap = getAllValuesClusters_(values);
const bestFit1 = findNextBestFitValuesCluster_(clustersMap, null);
const bestCluster1 = bestFit1.best_cluster;
const info = getInitialFitColumnValuesClustersInfo_(
  bestCluster1,
  values,
  clustersMap
);
const fitting = getColumnValueClustersRowFit_(info);

const reduced = reduceFittingClustersByMaxColumnGap_(
  fitting,
  bestCluster1,
  info.options.max_skipped_columns
);
const withHeaders = getAllMatchedColumnValueClutersHeaders_(reduced, info);

const islands = getColumnValueClusterHeaderIslands_(
  withHeaders.valid_headers_map,
  withHeaders.possible_rows_map
);
const biggestIslands = getBiggerClusterHeadersByIslands_(islands);
const fullInfo = getFullValuesClusterHeaderInfoMap_(
  biggestIslands,
  withHeaders
);
console.log("👀i", JSON.stringify(withHeaders)); //
console.log("👀iii", JSON.stringify(fullInfo)); // /
const bestFullInfoDuped = getBestValueClustersFullInfoForSchema_(fullInfo);

const bestFullInfo = getDedupedColumnsValuesClusterFullInfo_(bestFullInfoDuped);

const firstRow = getValuesClustersFirstDataRow_(
  bestFullInfo.map((el) => el.possible_rows_start),
  bestFullInfo[0].header.row_index
);

console.log("👀iiiiiiiiiiiiiiii", JSON.stringify(firstRow)); //

const bestClusters = bestFullInfo.map((el) => el.cluster);

const lastRowResponse = getValuesClustersLastDataRow_(bestClusters, info);

const missingRows = getCommonColumnValuesClustersMissingColumns_(
  lastRowResponse.matching_clusters.map((e) => e.indexes_null)
);

const missingColumns = getDataValuesClustersMissingColumns_(
  lastRowResponse.matching_clusters.map((c) => c.column_index)
);

const iniHeaders = bestFullInfo.map((e) => e.header);
const richHeaders = getRichColumnValuesClustersHeaders_(
  iniHeaders,
  info.options.max_header_lenght
);
