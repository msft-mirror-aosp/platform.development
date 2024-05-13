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

import {Traces} from 'trace/traces';
import {TRACE_INFO} from 'trace/trace_info';
import {ImeTraceType, TraceType} from 'trace/trace_type';
import {ViewerInputMethod} from 'viewers/common/viewer_input_method';
import {View, ViewType} from 'viewers/viewer';
import {PresenterInputMethodClients} from './presenter_input_method_clients';

class ViewerInputMethodClients extends ViewerInputMethod {
  static readonly DEPENDENCIES: ImeTraceType[] = [
    TraceType.INPUT_METHOD_CLIENTS,
  ];

  override readonly view: View;

  constructor(traces: Traces, storage: Storage) {
    super(traces, storage);
    this.view = new View(
      ViewType.TAB,
      this.getDependencies(),
      this.htmlElement,
      TRACE_INFO[TraceType.INPUT_METHOD_CLIENTS].name,
      TraceType.INPUT_METHOD_CLIENTS,
    );
  }

  override getDependencies(): ImeTraceType[] {
    return ViewerInputMethodClients.DEPENDENCIES;
  }

  override initialisePresenter(
    traces: Traces,
    storage: Storage,
  ): PresenterInputMethodClients {
    return new PresenterInputMethodClients(
      traces,
      storage,
      this.getDependencies(),
      this.imeUiCallback,
    );
  }
}

export {ViewerInputMethodClients};
