/*
 * Copyright (C) 2022 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {browser, element, by} from "protractor";
import {E2eTestUtils} from "./utils";

describe("Viewer WindowManager", () => {
  beforeAll(async () => {
    browser.manage().timeouts().implicitlyWait(1000);
    browser.get("file://" + E2eTestUtils.getProductionIndexHtmlPath());
  }),

  it("processes trace and renders view", () => {
    const inputFile = element(by.css("input[type=\"file\"]"));
    inputFile.sendKeys(E2eTestUtils.getFixturePath("traces/elapsed_and_real_timestamp/WindowManager.pb"));

    const loadData = element(by.css(".load-btn"));
    loadData.click();

    const windowManagerViewerTitle = element(by.css(".viewer-window-manager .title"));
    expect(windowManagerViewerTitle.getText()).toContain("Window Manager");
  });
});