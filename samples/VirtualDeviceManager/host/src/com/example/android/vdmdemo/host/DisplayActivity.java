/*
 * Copyright (C) 2025 The Android Open Source Project
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

package com.example.android.vdmdemo.host;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.example.android.vdmdemo.common.EdgeToEdgeUtils;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * VDM activity, showing an interactive virtual display.
 */
@AndroidEntryPoint(AppCompatActivity.class)
public class DisplayActivity extends Hilt_DisplayActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_display);
        Toolbar toolbar = requireViewById(R.id.main_tool_bar);
        setSupportActionBar(toolbar);

        EdgeToEdgeUtils.applyTopInsets(toolbar);
    }
}
