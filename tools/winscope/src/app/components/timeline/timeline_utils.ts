/*
 * Copyright (C) 2024 The Android Open Source Project
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

import {TimeRange, Timestamp} from 'common/time';
import {ComponentTimestampConverter} from 'common/timestamp_converter';
import {PropertyTreeNode} from 'trace/tree_node/property_tree_node';

export class TimelineUtils {
  static getTimeRangeForTransition(
    transition: PropertyTreeNode,
    fullTimeRange: TimeRange,
    converter: ComponentTimestampConverter,
  ): TimeRange | undefined {
    const shellData = transition.getChildByName('shellData');
    const wmData = transition.getChildByName('wmData');

    const aborted = transition.getChildByName('aborted')?.getValue() ?? false;

    const dispatchTimestamp: Timestamp | undefined = shellData
      ?.getChildByName('dispatchTimeNs')
      ?.getValue();
    const createTimestamp: Timestamp | undefined = wmData
      ?.getChildByName('createTimeNs')
      ?.getValue();
    const finishOrAbortTimestamp: Timestamp | undefined = aborted
      ? shellData?.getChildByName('abortTimeNs')?.getValue()
      : wmData?.getChildByName('finishTimeNs')?.getValue();

    // currently we only render transitions during 'play' stage, so
    // do not render if no dispatch time and no finish/shell abort time
    // or if transition created but never dispatched to shell
    // TODO (b/324056564): visualise transition lifecycle in timeline
    if (
      (!dispatchTimestamp && !finishOrAbortTimestamp) ||
      (!dispatchTimestamp && createTimestamp)
    ) {
      return undefined;
    }

    const timeRangeMin = fullTimeRange.from.getValueNs();
    const timeRangeMax = fullTimeRange.to.getValueNs();

    const dispatchTimeNs = dispatchTimestamp
      ? dispatchTimestamp.getValueNs()
      : timeRangeMin;
    const finishTimeNs = finishOrAbortTimestamp
      ? finishOrAbortTimestamp.getValueNs()
      : timeRangeMax;

    const startTime = converter.makeTimestampFromNs(
      dispatchTimeNs > timeRangeMin ? dispatchTimeNs : timeRangeMin,
    );
    const finishTime = converter.makeTimestampFromNs(finishTimeNs);

    return {
      from: startTime,
      to: finishTime,
    };
  }
}
