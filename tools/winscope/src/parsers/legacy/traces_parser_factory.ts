/*
 * Copyright (C) 2023 The Android Open Source Project
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

import {TracesParserCujs} from 'parsers/events/traces_parser_cujs';
import {TracesParserTransitions} from 'parsers/transitions/legacy/traces_parser_transitions';
import {Parser} from 'trace/parser';
import {Traces} from 'trace/traces';

export class TracesParserFactory {
  static readonly PARSERS = [TracesParserCujs, TracesParserTransitions];

  async createParsers(traces: Traces): Promise<Array<Parser<object>>> {
    const parsers: Array<Parser<object>> = [];

    for (const ParserType of TracesParserFactory.PARSERS) {
      try {
        const parser = new ParserType(traces);
        await parser.parse();
        parsers.push(parser);
      } catch (error) {
        // skip current parser
      }
    }

    return parsers;
  }
}
