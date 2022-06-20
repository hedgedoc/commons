/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { YDocMessageTransporter } from './y-doc-message-transporter'
import WebSocket from 'isomorphic-ws'
import { ConnectionKeepAliveHandler } from './connection-keep-alive-handler'
import { Doc } from 'yjs'
import { Awareness } from 'y-protocols/awareness'

export class WebsocketTransporter extends YDocMessageTransporter {
  private websocket: WebSocket | undefined

  constructor(doc: Doc, awareness: Awareness) {
    super(doc, awareness)
    new ConnectionKeepAliveHandler(this)
  }

  public setupWebsocket(websocket: WebSocket) {
    if (websocket.readyState === WebSocket.CLOSED || websocket.readyState === WebSocket.CLOSING) {
      throw new Error(`Socket is closed`)
    }
    this.websocket = websocket
    websocket.binaryType = 'arraybuffer'
    websocket.addEventListener('message', (event) => this.decodeMessage(event.data as ArrayBuffer))
    websocket.addEventListener('error', (event) => {
      console.error('Websocket error occured', event.error)
      this.disconnect()
    })
    websocket.addEventListener('close', () => {
      console.info('Socket closed')
      this.onClose()
    })
    if (websocket.readyState === WebSocket.OPEN) {
      this.onOpen()
    } else {
      websocket.addEventListener('open', this.onOpen.bind(this))
    }
  }

  public disconnect(): void {
    this.websocket?.close()
  }

  public send(content: Uint8Array): void {
    if (this.websocket?.readyState !== WebSocket.OPEN) {
      console.error("Can't send message over non-open socket")
      return
    }

    try {
      this.websocket.send(content)
    } catch (error: unknown) {
      console.error('Error while sending message', error)
      this.disconnect()
    }
  }
}
