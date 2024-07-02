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
import {Component, EventEmitter, Output} from '@angular/core';
import {UrlUtils} from 'common/url_utils';
import {proxyClient, ProxyState} from 'trace_collection/proxy_client';

@Component({
  selector: 'adb-proxy',
  template: `
    <ng-container [ngSwitch]="client.getState()">
      <ng-container *ngSwitchCase="state.NO_PROXY">
        <div class="further-adb-info-text">
          <p class="mat-body-1">
            Launch the Winscope ADB Connect proxy to capture traces directly from your browser.
          </p>
          <p class="mat-body-1">Python 3.5+ and ADB are required. Run this command:</p>
          <mat-form-field class="proxy-command-form" appearance="outline">
            <input matInput readonly [value]="proxyCommand" />
            <button
              mat-icon-button
              matSuffix
              [cdkCopyToClipboard]="proxyCommand"
              matTooltip="Copy command">
              <mat-icon>content_copy</mat-icon>
            </button>
          </mat-form-field>
          <p class="mat-body-1">Or download below.</p>
        </div>

        <div class="further-adb-info-actions">
          <button
            class="download-proxy-btn"
            color="primary"
            mat-stroked-button
            (click)="onDownloadProxyClick()">
            Download Proxy
          </button>
          <button color="primary" mat-stroked-button class="retry" (click)="onRetryButtonClick()">
            Retry
          </button>
        </div>
      </ng-container>

      <ng-container *ngSwitchCase="state.INVALID_VERSION">
        <div class="further-adb-info-text">
          <p class="icon-information mat-body-1">
            <mat-icon class="adb-icon">update</mat-icon>
            <span class="adb-info">Your local proxy version is incompatible with Winscope.</span>
          </p>
          <p class="mat-body-1">
            Please update the proxy to version {{ clientVersion }}. Run this command:
          </p>
          <mat-form-field class="proxy-command-container" appearance="outline">
            <input matInput readonly [value]="proxyCommand" />
            <button
              mat-icon-button
              matSuffix
              [cdkCopyToClipboard]="proxyCommand"
              matTooltip="Copy command">
              <mat-icon>content_copy</mat-icon>
            </button>
          </mat-form-field>
          <p class="mat-body-1">Or download below.</p>
        </div>

        <div class="further-adb-info-actions">
          <button
            class="download-proxy-btn"
            color="primary"
            mat-stroked-button
            (click)="onDownloadProxyClick()">
            Download Proxy
          </button>
          <button color="primary" mat-stroked-button class="retry" (click)="onRetryButtonClick()">
            Retry
          </button>
        </div>
      </ng-container>

      <ng-container *ngSwitchCase="state.UNAUTH">
        <div class="further-adb-info-text">
          <p class="icon-information mat-body-1">
            <mat-icon class="adb-icon">lock</mat-icon>
            <span class="adb-info">Proxy authorisation required.</span>
          </p>
          <p class="mat-body-1">Enter Winscope proxy token:</p>
          <mat-form-field
            class="proxy-key-input-field"
            (keydown.enter)="onKeydownEnterProxyKeyInput($event)">
            <input matInput [(ngModel)]="proxyKeyItem" name="proxy-key" />
          </mat-form-field>
          <p class="mat-body-1">
            The proxy token is printed to console on proxy launch, copy and paste it above.
          </p>
        </div>

        <div class="further-adb-info-actions">
          <button color="primary" mat-stroked-button class="retry" (click)="onRetryButtonClick()">
            Connect
          </button>
        </div>
      </ng-container>

      <ng-container *ngSwitchDefault></ng-container>
    </ng-container>
  `,
  styles: [
    `
      .icon-information {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .further-adb-info-text {
        display: flex;
        flex-direction: column;
        overflow-wrap: break-word;
        gap: 10px;
        margin-bottom: 10px;
      }
      .further-adb-info-actions {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;
      }
      /* TODO(b/300063426): remove after migration to angular 15, replace with subscriptSizing */
      ::ng-deep .proxy-command-form .mat-form-field-wrapper {
        padding: 0;
      }
      .proxy-command-text {
        user-select: all;
        overflow: auto;
      }
      .adb-info {
        margin-left: 5px;
      }
    `,
  ],
})
export class AdbProxyComponent {
  @Output()
  readonly addKey = new EventEmitter<string>();

  client = proxyClient;
  state = ProxyState;
  proxyKeyItem = '';
  readonly clientVersion = this.client.VERSION;
  readonly downloadProxyUrl: string =
    UrlUtils.getRootUrl() + 'winscope_proxy.py';
  readonly proxyCommand: string =
    'python3 $ANDROID_BUILD_TOP/development/tools/winscope/src/adb/winscope_proxy.py';

  async onRetryButtonClick() {
    if (this.proxyKeyItem.length > 0) {
      this.addKey.emit(this.proxyKeyItem);
    }
    await this.client.setState(this.state.CONNECTING);
  }

  async onKeydownEnterProxyKeyInput(event: MouseEvent) {
    (event.target as HTMLInputElement).blur();
    await this.onRetryButtonClick();
  }

  onDownloadProxyClick() {
    window.open(this.downloadProxyUrl, '_blank')?.focus();
  }
}
