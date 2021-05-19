/**
 * @Author: abbeymart | Abi Akindele | @Created: 2021-05-19
 * @Company: Copyright 2021 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: plugin entry point
 */

import McDataTable from "./components/mc-data-table/McDataTable.vue";
import { App } from "vue";

const McDataTableComponent = {
    install(app, options) {
        // register the component globally
        app.component("mc-data-table", McDataTable);
    }
};

// Automatic installation if Vue(app) has been added to the global scope.
if (typeof window !== "undefined" && window.app) {
    window.app.use(McDataTable);
}

export default McDataTableComponent;
